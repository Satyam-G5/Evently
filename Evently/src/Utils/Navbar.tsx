import React, { useState ,useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../Context_api/user.context';

const Navbar: React.FC = () => {
    const appcontext = useContext(AppContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const logout =async () => {
    appcontext?.changeLoginState(false);
  } 

  return (
    <nav className="w-full h-20 bg-custom fixed top-0 flex justify-between z-10 ">
      <div className=" text-orange-800 font-bold flex flex-row bg-gray-100 h-20 rounded-r-full w-44">
       <span className=" text-black bg-clip-text text-4xl mt-4 ml-3">
          <Link className='text-orange-800 font-custom ml-3' to='/'>
            Evently
          </Link>
        </span>
      </div>

      {/* Mobile Menu Button */}
      <div className="flex flex-col items-center mt-1 mr-2 md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="text-xl text-gray-600 p-5 flex flex-row hover:cursor-pointer hover:text-gray-950 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-menu-2" width="40" height="40" viewBox="0 0 24 24" stroke-width="2" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 6l16 0" />
            <path d="M4 12l16 0" />
            <path d="M4 18l16 0" />
          </svg>
        </button>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden flex flex-col rounded-md items-center bg-yellow-400 border-4 border-solid border-gray-100 w-36">
        <Link to="/home" className="text-xl text-white p-3 hover:cursor-pointer ">
          Home
        </Link>

        <Link to="/About" className="text-xl text-white p-3 hover:cursor-pointer">
          About
        </Link>

        <Link to="/premium" className="text-xl text-white p-3 hover:cursor-pointer">
          Premium
        </Link>
          </div>
        )}
      </div>


      {/* Desktop Menu */}
      <div className="hidden md:bg-orange-800 md:rounded-full md:h-16 md:w-96 border-t-4 md:flex md:flex-row md:justify-evenly md:mt-8 md:mr-2 ">

        <Link to="/home" className="text-xl text-white p-3 hover:cursor-pointer ">
          Home
        </Link>

        <Link to="/About" className="text-xl text-white p-3 hover:cursor-pointer">
        About Me
        </Link>

        <Link to="/premium" className="text-xl text-white p-3 hover:cursor-pointer">
          Premium
        </Link>
      </div>



      <div className="mt-3.5 mr-2 justify-center">
        {appcontext?.loginState ? <Link to="/">
          <div onClick={logout} className="p-2 bg-white mr-4 rounded-lg shadow-lg hover:bg-failred hover:cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-logout" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
              <path d="M9 12h12l-3 -3" />
              <path d="M18 15l3 -3" />
            </svg>
          </div>
        </Link> : <Link className='w-16 h-auto' to="/signIn">
          <div className="ml-3 bg-yellow-500 text-white flex flex-row p-2 mr-4 rounded-full shadow-lg hover:bg-slate-300 hover:cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-105">
          {/* <div className='font-semibold mr-2 mt-1'>
            LogIn
          </div> */}
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user-circle-2"><path d="M18 20a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4" /><circle cx="12" cy="12" r="10" /></svg>
          </div>
        </Link> }
        
        
      </div>
    </nav>
  );
}

export default Navbar;
