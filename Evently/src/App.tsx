import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from "./Utils/Navbar"
import Start_page from './components/start_page';
import Home from './components/Home';
import SignIn from './components/signIn';
import Register from './components/register';
import PricingPlan from './components/PricingPlan';
import Events from './components/Events';
import Book_meeting from './components/Book_meeting';
import Join_meet from './components/join_meet';
import PaymentFailure from './Payments/PaymentFailure';
import PaymentSuccess from './Payments/PaymentSuccess';
import About from './components/About';


import { AppProvider as UserAppProvider } from "./Context_api/user.context"
import { AppProvider as SocketProvider } from "./Context_api/socket.context"


function App() {
  
  return (
    <>
     
        <UserAppProvider>
          <Router>
            <SocketProvider>
              <Routes>
                <Route path="/" element={<><Navbar /><Start_page /></>} />
                <Route path="/home" element={<><Navbar /><Home /></>} />
                <Route path="/signIn" element={<><Navbar /><SignIn /></>} />
                <Route path="/register" element={<><Navbar /><Register /></>} />
                <Route path="/premium" element={<><Navbar /> <PricingPlan /></>} />
                <Route path="/Events" element={<><Navbar /><Events /></>} />
                {/* <Route path="/book_meetings/:username/:category/:meetingId" element={<><Navbar /><Book_meeting /></>} /> */}
                <Route path="/booking/:username/:category/:meetingId" element={<><Navbar /><Book_meeting /></>} />
                <Route path="/meet_link/:category/:meetingId" element={<><Navbar /><Join_meet /></>} />
                <Route path="/payment_success" element={<><PaymentSuccess /></>} />
                <Route path="/payment_failed" element={<><PaymentFailure /></>} />
                <Route path="/About" element={<><About /></>} />
              </Routes>
            </SocketProvider>
          </Router>
        </UserAppProvider>
    </>
  )
}

export default App
