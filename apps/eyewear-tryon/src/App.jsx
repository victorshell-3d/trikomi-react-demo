import './App.css'
import MediaSelector from './MediaSelector'
import ThumbGenerator from './ThumbGenerator'
import { useEffect } from 'react'


function App() {


  useEffect(() => {
    // Always hide spinner initially
    const spinner = document.getElementById('spinner');
    if (spinner) spinner.style.display = 'none';
  }, [])



  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: 'var(--bg-color)' }}>

      <MediaSelector />
    </div>
  )
}

export default App
