import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion';

const start_page: React.FC = () => {
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='flex-row text-center justify-center items-center p-2 w-4/5'>

        <motion.h1 initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }} className='md:text-7xl text-4xl font-semibold'>Create your own plan with calendars reminder
        </motion.h1>

        <motion.h1 initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }} className='text-2xl md:w-3/4 md:ml-36 mt-8 font-custom text-slate-600'>
            Evently is the easiest way for teams to plan, manage, and visualize their work in a shared team calendar.
        </motion.h1>


        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1 }}
          className='flex md:flex-row md:justify-center flex-col items-center p-2'>

          <Link className='' to="/signIn">
            <button className='flex flex-row mt-12 md:ml-6 h-12 w-40 text-white bg-orange-800 hover:text-white hover:bg-black font-semibold border-2 '>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="ml-2 mr-2 mt-2 lucide lucide-sparkle"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z" /></svg>                
              <span className='mt-2 ml-2 font-semibold'>Get Started</span>
            </button>
          </Link>
          <Link className='font-custom' to="/register">
            <button className='flex flex-row mt-12 md:ml-6 h-12 w-88 text-black hover:text-white hover:bg-black font-semibold border-2 rounded-full border-black'>
              <span className='mt-2 ml-2 text-md font-semibold'>Register with Us</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="ml-2 mr-2 mt-2 lucide lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </button>
          </Link>
        </motion.div>

        <motion.div
        // initial={{ opacity: 0, x: 100, scale: 0.5 }}
        // animate={{ opacity: 1, x: 0, scale: 1 }}
        // transition={{ duration: 1 }}
        className='text-orange-800 bottom-16 right-16 fixed border-4 border-black rounded-full p-2 hover:cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-105'
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          
        </motion.div>
      </div>

    </div>
  )
}

export default start_page
