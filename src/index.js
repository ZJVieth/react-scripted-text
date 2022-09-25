import React from 'react'

import useScriptedText from './scriptHook'
export { useScriptedText }

export default function ScriptedText({ className, script }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: useScriptedText({ script_file: script }) }} />
}
