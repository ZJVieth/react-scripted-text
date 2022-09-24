export const EXPECT = {
    NONE: 0,
    TEXT: 1,
}

export function mergeSettings(settings, tempSettings) {
    let out = { ...settings }
    for (let obj of tempSettings)
        Object.entries(obj).forEach(([key, value]) => {
            if (key !== "n")
                out[key] = value
        })
    // console.log(out)
    return out
}
function decrementTempSettings(tempSettings) {
    let output = []
    for (let obj of tempSettings) {
        let new_n = obj.n - 1
        // console.log(obj)
        if (new_n >= 0)
            output = [...output, { ...obj, n: new_n }]
    }
    return output
}

// LINE INTERPRETER -----------------------------------------------
export default function interpretLine(
    line,
    state,
    settings,
    currOutput,
    funcs,
    tempSettings
) {
    line = line.trim()
    state = { ...state }
    state.lineIndex++
    let useSettings = mergeSettings(settings, tempSettings)

    // console.log(state)

    // Comments and empty lines
    if (line.substring(0, 2) === "//" || line === "")
        return state

    // Command execution
    if (line[0] === "*") {

        if (state.expecting == EXPECT.TEXT) {
            console.error(`Script Error: Expecting a text line for language ${settings.langs[state.expecting_i]} in line ${state.lineIndex}.`)
            state.expecting = EXPECT.NONE
        }

        let [, cmd] = line.split(" ")

        if (cmd === "clear") {
            state.expecting = EXPECT.NONE
            funcs.setOutput("")
            return state
        }
        if (cmd === "wait") {
            funcs.setWaitState({ waiting: true, duration: settings.delay })
            console.log("Starting to wait.")
            return state
        }
        if (cmd === "langs") {
            let langs = line.split(" ")[2].split("/")
            funcs.setSettings({ ...settings, langs: langs })
            return state
        }
        if (cmd === "set") {
            let [, , key, val, temp_n] = line.split(" ")
            const addSettings = {}
            addSettings[key] = val

            if (line[1] === "n") {
                funcs.setTempSettings([...tempSettings, { ...addSettings, n: temp_n ? temp_n : 1 }])
                return state
            }

            funcs.setSettings({ ...settings, ...addSettings })
            return state
        }

        // console.error(`ScriptError: Unrecognized command ${cmd} in line ${lineIndex}.`)
        return state
    }

    console.log(line, state)

    // Text Line Interpreting
    if (state.expecting == EXPECT.NONE) {
        funcs.setTempSettings(decrementTempSettings(tempSettings))
        useSettings = mergeSettings(settings, decrementTempSettings(tempSettings))
        state.expecting = EXPECT.TEXT
        state.expecting_n = useSettings.langs.length - 1
        state.expecting_i = 0
    }

    console.log(line, state, useSettings.langs.indexOf(useSettings.lang))

    // only printing the line of chosen language
    if (state.expecting_i == useSettings.langs.indexOf(useSettings.lang)) {
        funcs.setOutput(currOutput + "<p>")
        funcs.setCurrLineOut(line)
    }

    // reset expecting value once text line of each language has been read
    if (state.expecting_i >= state.expecting_n) {
        state.expecting = EXPECT.NONE
        state.expecting_i = 0
        funcs.setOutput(currOutput + "</p>")
    }

    state.expecting_i++

    return state
}