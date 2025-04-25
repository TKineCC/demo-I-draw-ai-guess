import React from 'react'
import ReactDOM from 'react-dom/client'
import Canvas from './Canvas'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <React.StrictMode>
    <Canvas width={800} height={600} />
  </React.StrictMode>
)