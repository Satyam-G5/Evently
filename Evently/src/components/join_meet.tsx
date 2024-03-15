import React, { useContext, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import SocketContext from "../Context_api/socket.context";
import AppContext from "../Context_api/user.context"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import image from '../assets/back-transformed.jpeg'


const join_meet: React.FC = () => {


  const contextSocket = useContext(SocketContext);
  const contextapp = useContext(AppContext);


  const socket = contextSocket?.socket;

  interface Message {
    senderID: string;
    MessageString: string;
  }

  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [targetMessage, settargetMessage] = useState<string>("");


  const handleSendMessage = () => {
    const data: Message = {
      senderID: contextapp?.Email,
      MessageString: targetMessage
    }
    setMessages((prevMessages) => [...prevMessages, data]);
    socket?.emit('sendMessage', { data })
    console.log("sending message : ", data);
    settargetMessage('');
  }

  const handleUserJoined = (mail:any) => {
    toast(`${mail} joined the room Start Meeting . Click on connect `)
  }


  useEffect(() => {
    const handleGetMessage = ({ data }: any) => {
      console.log("data on getMessasge: ", data);

      const newMessage: Message = {
        senderID: data.senderID,
        MessageString: data.MessageString
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };
    socket?.on('getMessasge', handleGetMessage);
    socket?.on('user:joined_toast', handleUserJoined);
    return () => {
      socket?.off('getMessasge', handleGetMessage);
      socket?.off('user:joined_toast', handleUserJoined);
    };
  }, [socket , handleUserJoined]);


  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  useEffect(()=>{

  },[])


  return (
    <div className="h-screen bg-cover" style={{ backgroundImage: `url(${image})` }}>

    <div className="h-screen w-screen ">
      <ToastContainer theme="dark" className='w-full md:w-1/2 mt-32 md:mt-40' />

      <div className="flex flex-row justify-center p-4 ">

        <div className="flex mt-20 flex-col items-center justify-center">
          <div className=" relative">
            <div className="flex w-full flex-row justify-between">
              <h1 className="mt-4 p-2 text-3xl text-black font-extrabold ">Conferencing Room</h1>
              
            </div>


            <div className="mt-4 flex flex-col justify-evenly items-center">
              <div style={{ height: '400px', width: '800px' }}>

              {contextSocket?.remoteStream && (
                <>
                  <h1 className="bg-white text-center font-semibold">{contextapp?.Email}</h1>
                  <div className="shadow-lg overflow-hidden">
                    <ReactPlayer
                      playing
                      muted = {false}
                      height="400px"
                      width="800px"
                      url={contextSocket?.remoteStream}
                    />
                  </div>
                </>
              )}
              </div>

              {contextSocket?.localStream && (
                <div className="absolute  bottom-0 right-0">
                  <div className="border-4 border-white shadow-lg overflow-hidden">
                    <ReactPlayer
                      playing
                      muted
                      height="150px"
                      width="200px"
                      url={contextSocket?.localStream}
                    />
                  <h1 className="text-center ml-2 font-semibold">{contextapp?.Name}</h1>
                  </div>
                </div>
                
              )}
            </div>
            <div className="flex flex-row justify-evenly items-center mt-8 w-3/4 p-2">
              {contextSocket?.host == contextapp?.Email ? 
              
            <div className="w-60 flex justify-center items-center text-white">
              <button
                onClick={() => contextSocket?.handleCallUser()}
                className="w-32 h-10 rounded-sm flex flex-row bg-green-600 hover:bg-green-800 hover:cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-105"
              >
                <div className="mt-2 ml-4 font-semibold">Connect</div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide mt-1 ml-1 mr-2 lucide-video"
                >
                  <path d="m22 8-6 4 6 4V8Z" />
                  <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
                </svg>
              </button>
            </div>
              :
            <div className="w-60 flex justify-center items-center text-white">
              <button
                // onClick={() => contextSocket?.handleCallUser()}
                className="w-40 h-10 rounded-sm flex flex-row bg-gray-600 hover:bg-gray-800 hover:cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-105"
              >
                <div className="mt-2 ml-4 font-semibold">Waiting for Host</div>
               
              </button>
              </div>
              
              }
              <div onClick={contextSocket?.end_call} className="w-16 text-white h-auto p-1 bg-red-800 rounded-full hover:cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-105 ">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide rounded-full w-10 h-6 ml-2 lucide-phone-off"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" /><line x1="22" x2="2" y1="2" y2="22" /></svg>              </div>
              <div className="w-16 text-white h-auto p-1 bg-blue-800 rounded-full hover:cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-105 ">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide rounded-full w-10 h-6 ml-2 lucide-video-off"><path d="M10.66 6H14a2 2 0 0 1 2 2v2.34l1 1L22 8v8" /><path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2l10 10Z" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
              </div>
              <div className="w-16 text-white h-auto p-1 bg-blue-800 rounded-full hover:cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-105 ">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide rounded-full w-10 h-6 ml-2 lucide-mic-off"><line x1="2" x2="22" y1="2" y2="22" /><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" /><path d="M5 10v2a7 7 0 0 0 12 5" /><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
              </div>
            </div>

          </div>

        </div>
        <div className='flex flex-col items-center md:ml-12 w-full mt-32'>

          <div className="h-96  overflow-y-scroll p-4 md:w-3/4 w-[90%] shadow-xl mb-[4%] border-gray-200 border-2">
            {messages && messages.length > 0 ? (
              messages.map((message) => (
                <div
                  // key={index}
                  className={`mb-4 ${message.senderID == contextapp?.Email ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`rounded-lg p-2 max-w-3/4 inline-block ${message.senderID == contextapp?.Email ? 'bg-orange-800 text-white' : 'bg-gray-200'
                      }`}
                  >
                    {message.MessageString}
                  </div>
                  <div ref={messageContainerRef}></div>
                </div>

              )
              )) : <div className="flex justify-center font-custom font-semibold"> Start Messaging Now </div>}
          </div>

          <div className="flex w-[60%] shadow-lg rounded-lg">
            <input
              type="text"
              className="w-full p-2 border rounded-l-lg"
              placeholder="Type your message..."
              value={targetMessage}
              onChange={(e) => settargetMessage(e.target.value)}
            />
            <button
              className="  p-2 rounded-r-lg"
              onClick={handleSendMessage}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-send" width="30" height="30" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 14l11 -11" />
                <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default join_meet

