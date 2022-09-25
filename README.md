# react-scripted-text (Alpha)

> React component and hook to display script-based text output.


[![NPM](https://img.shields.io/npm/v/react-scripted-text.svg)](https://www.npmjs.com/package/react-scripted-text) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-scripted-text
```

## Usage

```jsx
import React from 'react'

import ScriptedText from 'react-scripted-text'

const App = () => {
  return (
    <div>
      <ScriptedText script="text_script.txt" />
      {/* or */}
      <div>
        { useScriptedText({script_file: "text_script.txt"})}
      </div>
    </div>
  )
}

export default App
```

```txt
// see github example/public/script.txt for an example
// this section will be updated soon
```

## Version History

### 0.1.1 Usability Fixes
- removed console.logs
- changed ScriptedText property to *script* (formerly *script_file*)

### 0.1.0 Alpha Release
- ScriptedText component
- useScriptedText hook
- Available commands: langs, set (lang, delay, speed), *n, wait, clear

## License

MIT © [ZJVieth](https://github.com/ZJVieth)
