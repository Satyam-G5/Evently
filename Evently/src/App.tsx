import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from "./Utils/Navbar"

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route  path ="/"  element = {<><Navbar/></>}  />
        
      </Routes>
    </Router>
     
    </>
  )
}

export default App
