import React from 'react'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  return (
    <div className='flex justify-between mt-32'>
      <div className='flex flex-row justify-between w-full h-full'>
        <div className='hidden md:flex flex-col md:w-1/5 border-4 min-h-96 border-x-black border-y-white'>
          <Link className='mt-4 text-md text-gray-600 font-semibold ml-8 p-1 hover:underline flex flex-row' to="/Home">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>

            <p className='ml-5 font-custom'> Dashboard </p>
          </Link>

          <Link className='mt-4 text-md text-gray-600 font-semibold ml-8 p-1 hover:underline flex flex-row' to="/Events">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-calendar-check-2"><path d="M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m16 20 2 2 4-4"/></svg>
            <p className='ml-5 font-custom'>Events</p>
          </Link>

          <Link className='mt-4 text-md text-gray-600 font-semibold ml-8 p-1 hover:underline flex flex-row' to="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <p className='ml-5 font-custom'> Home </p>
          </Link>

        </div>

        <div className='flex flex-col md:w-3/4'>
          <h1 className='font-semibold text-5xl text-center md:ml-0 ml-12'>Upcomming Meetings</h1>
          <div className='mt-8 justify-center items-center flex'>
            <p>No Bookings yet</p>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Home
