import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from "./Utils/Navbar"
import Start_page from './pages/start_page';
import Home from './pages/Home';
import SignIn from './pages/signIn';
import Register from './pages/register';
import PricingPlan from './pages/PricingPlan';


import { AppProvider as UserAppProvider } from "./Context_api/user.context"
// import { AppProvider as SocketProvider } from "./context/socket.context"


function App() {
  return (
    <>
      <UserAppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<><Navbar /><Start_page /></>} />
            <Route path="/home" element={<><Navbar /><Home /></>} />
            <Route path="/signIn" element={<><Navbar /><SignIn /></>} />
            <Route path="/register" element={<><Navbar /><Register /></>} />
            <Route path="/premium" element={<><Navbar /><PricingPlan /></>} />

          </Routes>
        </Router>
      </UserAppProvider>

    </>
  )
}

export default App
