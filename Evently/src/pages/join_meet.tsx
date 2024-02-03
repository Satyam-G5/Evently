import React, { useContext, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import SocketContext from "../Context_api/socket.context";
import AppContext from "../Context_api/user.context"

const join_meet: React.FC = () => {
    const contextSocket = useContext(SocketContext);
    const contextapp = useContext(AppContext);

    const [myStream, setMyStream] = useState<MediaStream | undefined>();
    const [remoteStream, setRemoteStream] = useState<MediaStream | undefined>();

    useEffect(() => {

        setMyStream(contextSocket?.localStream)
        setRemoteStream(contextSocket?.remoteStream)

        console.log("local stream : ", contextSocket?.localStream)
        console.log("remote stream : ", contextSocket?.remoteStream)

    }, [contextSocket?.localStream, contextSocket?.remoteStream])



    return (
        <div className=" h-screen bg-custom">
            <div className="mt-20 bg-custom">
                <h1 className="mt-12 p-2 text-4xl text-black font-semibold">Video Conferencing</h1>

                <div className="mt-4 flex md:flex-row flex-col justify-evenly ">

                    {contextSocket?.localStream && (
                        <>
                            <h1 className="font-semibold">{contextapp?.Name}</h1>
                            <div className="border-4 border-green-950 rounded-full overflow-hidden">
                                <ReactPlayer
                                    playing
                                    muted
                                    height="300px"
                                    width="400px"
                                    url={contextSocket?.localStream}
                                />
                            </div>
                        </>
                    )}
                    <div className=' w-80 flex justify-center items-center mt-4 text-white'>
                        <button onClick={()=>contextSocket?.handleCallUser()} className='w-44 h-10 rounded-sm flex flex-row bg-blue-600 hover:bg-blue-800 hover:cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-105'>
                            <div className='mt-2 ml-4 font-semibold'>Join Meeting</div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide mt-1 ml-1 mr-2 lucide-video"><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></svg>
                        </button>
                    </div>

                    {contextSocket?.remoteStream && (
                        <>
                            <h1 className="font-semibold">{contextapp?.Email}</h1>
                            <div className="border-4 border-green-950 rounded-full overflow-hidden">

                                <ReactPlayer
                                    playing
                                    muted
                                    height="300px"
                                    width="400px"
                                    url={contextSocket?.remoteStream} // Adjust this to match the correct property
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default join_meet