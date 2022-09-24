import React from 'react'

import ScriptedText, { useScriptedText } from 'react-scripted-text'
import 'react-scripted-text/dist/index.css'

const App = () => {
  // return <ScriptedText script_file="script.txt" />
  return <div dangerouslySetInnerHTML={{ __html: useScriptedText({ script_file: "script.txt" }) }} />
}

export default App
