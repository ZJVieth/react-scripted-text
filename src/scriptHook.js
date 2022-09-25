import { useState, useEffect } from 'react'
import interpretLine, { EXPECT, mergeSettings } from './interpreter'

const defaultSettings = {
    langs: ["English"],
    lang: "English",
    delay: 1000,
    speed: 100,
    className: "",
    style: {
        width: "95%",
        height: "400px"
    }
}

const ADD_STATUS = {
    SUCCESS: 0,
    LINE_COMPLETE: 1
}

export default function useScriptedText(props = {}) {
    props = {
        settings: defaultSettings,
        script: null,
        script_file: "",
        ...props
    }

    // States ---------------------------------------------------

    // States related to text box and script settings
    const [script_list, setScript_list] = useState(props.script)
    const [settings, setSettings] = useState(props.settings)
    const [tempSettings, setTempSettings] = useState([])

    // States related to the interpreter
    const [interpreterState, setInterpreterState] = useState({
        lineIndex: 0,
        expecting: EXPECT.NONE,
        expecting_i: 0,
        expecting_n: 0
    })

    // States related to the returned text
    const [output, setOutput] = useState("")
    const [letterIndex, setLetterIndex] = useState(0)
    const [currLineOut, setCurrLineOut] = useState("")
    const [waitState, setWaitState] = useState({ waiting: false })

    // INIT Script Loading --------------------------------------
    if (script_list == null) {
        fetch(props.script_file)
            .then(r => r.text())
            .then(text => {
                const list = text.split("\n")
                setScript_list(list)
            })
    }


    // MAIN TIMER for letter adding ------------------------------
    useEffect(() => {
        let letterTimer = null
        if (currLineOut !== "" & !waitState.waiting) {
            const useSettings = mergeSettings(settings, tempSettings)
            letterTimer = setInterval(
                () => {
                    const outObj = addLetterToOut(output, currLineOut, letterIndex)

                    if (outObj.status == ADD_STATUS.LINE_COMPLETE) {
                        setCurrLineOut("")
                        setLetterIndex(0)
                        return
                    }
                    // console.log(outObj.val)
                    setOutput(outObj.val)
                    setLetterIndex(outObj.index)
                },
                useSettings.speed
            )
        }

        return () => {
            clearInterval(letterTimer)
        }
    }, [settings, currLineOut, output, waitState])


    // WAITING TIMER ---------------------------------------------
    useEffect(() => {
        let waitTimer = null
        if (waitState.waiting) {
            if (waitState.duration)
                waitTimer = setInterval(
                    () => {
                        setWaitState({ waiting: false })
                    },
                    waitState.duration
                )
        }

        return () => {
            clearInterval(waitTimer)
        }
    }, [waitState])


    // MAIN EFFECT for interpreting the script -------------------
    // receives the "currLineOut" or updated "output" from the script
    useEffect(() => {
        if (script_list === null)
            return

        if (currLineOut === "" && !waitState.waiting) {
            if (interpreterState.lineIndex >= script_list.length)
                return

            // console.log("Read this:", script_list[interpreterState.lineIndex])

            const funcs = {
                setOutput,
                setCurrLineOut,
                setInterpreterState,
                setSettings,
                setWaitState,
                setTempSettings
            }
            const interState = interpretLine(
                script_list[interpreterState.lineIndex],
                interpreterState,
                settings,
                output,
                funcs,
                tempSettings
            )
            setInterpreterState(interState)
        }

    }, [script_list, currLineOut, interpreterState, waitState])


    // OUTPUT ----------------------------------------------------
    return output
}


// LETTER ADDING LOGIC --------------------------------------------
function addLetterToOut(currOutput, currLineOut, letterIndex) {
    if (letterIndex >= currLineOut.length)
        return { val: currOutput, index: 0, status: ADD_STATUS.LINE_COMPLETE }

    let newOutput = currOutput + currLineOut[letterIndex]
    letterIndex++

    // In case of special characters, also add the following character if applicable.
    if ([' ', ".", ",", "!", "?"].includes(currLineOut[letterIndex - 1]) && letterIndex < currLineOut.length) {
        newOutput = newOutput + currLineOut[letterIndex]
        letterIndex++;
    }

    return { val: newOutput, index: letterIndex, status: ADD_STATUS.SUCCESS }
}

