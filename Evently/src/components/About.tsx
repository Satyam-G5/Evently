import React from 'react'
import { Link } from 'react-router-dom'

const About: React.FC = () => {
    return (
        <div className='h-screen w-screen'>
            <div className='bg-blue-800 h-1/4'>
                <Link to="/" className=' ml-2 text-white'><svg xmlns="http://www.w3.org/2000/svg" width="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="ml-2 lucide lucide-arrow-left-circle"><circle cx="12" cy="12" r="10" /><path d="M16 12H8" /><path d="m12 8-4 4 4 4" /></svg></Link>
                <div className='flex flex-col justify-center items-center text-white'>
                    <h6 className='md:text-xl text-md'>Evently , A project by -</h6>
                    <h1 className='md:text-7xl text-4xl'>Satyam Shukla</h1>
                </div>
            </div>
            <div className='mt-4 flex flex-col justify-center items-center'>
                <h1 className='text-3xl font-bold mt-4'>Evently</h1>
                <p className='w-3/4 mt-4 text-center font-semibold text-gray-600 '>Evently is a feature-packed project that simplifies event management through scheduling, booking, conferencing, and reminders. It utilizes the PERN stack (PostgreSQL, Express.js, React, Node.js) with TypeScript for robust type safety. The inclusion of Redis optimizes data caching for improved performance. Real-time communication is facilitated through WebSocket using Socket.IO, enabling instant updates. Additionally, Evently integrates WebRTC for secure and high-quality face-to-face meetings. This combination of technologies ensures a seamless and efficient user experience, making Evently a cutting-edge solution for all event-related needs.
                </p>
            </div>
            <div className='mt-4 flex flex-col justify-center items-center'>
            <h1 className='text-3xl font-bold mt-4'>Tech-Stack Explored</h1>
    <div className='flex flex-wrap justify-center items-center mt-4'>
        <div className='flex flex-row items-center m-2 p-2 bg-gray-200 rounded-full'>
            <span className="text-gray-800 mr-2">React</span>
        </div>
        <div className='flex flex-row items-center m-2 p-2 bg-gray-200 rounded-full'>
            <span className="text-gray-800 mr-2">Node.js</span>
        </div>
        <div className='flex flex-row items-center m-2 p-2 bg-gray-200 rounded-full'>
            <span className="text-gray-800 mr-2">Express.js</span>
        </div>
        <div className='flex flex-row items-center m-2 p-2 bg-gray-200 rounded-full'>
            <span className="text-gray-800 mr-2">PostgreSQL</span>
        </div>
        <div className='flex flex-row items-center m-2 p-2 bg-gray-200 rounded-full'>
            <span className="text-gray-800 mr-2">TypeScript</span>
        </div>
        <div className='flex flex-row items-center m-2 p-2 bg-gray-200 rounded-full'>
            <span className="text-gray-800 mr-2">Redis</span>
        </div>
        <div className='flex flex-row items-center m-2 p-2 bg-gray-200 rounded-full'>
            <span className="text-gray-800 mr-2">Socket.IO</span>
        </div>
        <div className='flex flex-row items-center m-2 p-2 bg-gray-200 rounded-full'>
            <span className="text-gray-800 mr-2">WebRTC</span>
        </div>
    </div>
            </div>
        </div>
    )
}

export default About
