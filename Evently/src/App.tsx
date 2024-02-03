import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from "./Utils/Navbar"
import Start_page from './pages/start_page';
import Home from './pages/Home';
import SignIn from './pages/signIn';
import Register from './pages/register';
import PricingPlan from './pages/PricingPlan';
import Events from './pages/Events';
import Book_meeting from './pages/Book_meeting';
import Join_meet from './pages/join_meet';


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
              <Route path="/premium" element={<><Navbar /><PricingPlan /></>} />
              <Route path="/Events" element={<><Navbar /><Events /></>} />
              {/* <Route path="/book_meetings/:username/:category/:meetingId" element={<><Navbar /><Book_meeting /></>} /> */}
              <Route path="/booking/:username/:category/:meetingId" element={<><Navbar /><Book_meeting /></>} />
              <Route path="/meet_link/:category/:meetingId" element={<><Navbar /><Join_meet /></>} />
            </Routes>
        </SocketProvider>
          </Router>
      </UserAppProvider>

    </>
  )
}

export default App
