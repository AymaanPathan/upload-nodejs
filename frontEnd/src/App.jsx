import { useState } from 'react'
import axios from 'axios'

function App() {
  const [file, setFile] = useState()

  const upload = ()=>{
    const formData = new FormData()
    formData.append('file',file);
    axios.post('http://localhost:3000/upload',formData)
    .then((res)=>console.log(res))
    .catch((err)=>console.log(err))
  }
  return (
    <>
    <input type="file" onChange={(e)=>setFile(e.target.files[0])} />
    <button onClick={upload}>Upload</button>
    </>
  )
}

export default App
