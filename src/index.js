import React from 'react'

import useScriptedText from './scriptHook'
export { useScriptedText }

export default function ScriptedText({ className, script_file }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: useScriptedText({ script_file: script_file }) }} />
}
