import { useEffect, useState, useContext } from 'react';
import AppContext from '../Context_api/user.context';
import SocketContext from '../Context_api/socket.context';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import image from '../assets/back-transformed.jpeg'


const Home: React.FC = () => {

  const appex = useContext(AppContext);
  const socex = useContext(SocketContext);

  interface book_face {
    link: string;
    booker: String;
    host: string;
    users: string;
    video_chat: string;
    date: string;
    time: string;
  }

  const [MeetingLink, setMeetingLink] = useState('');
  const [Eventname, setEventName] = useState("");
  const [book, setbook] = useState<book_face[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [hostab, sethostab] = useState<boolean>(false)


  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const hostpr = () => {
    sethostab(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(MeetingLink)
      .then(() => {
        console.log('Meeting link copied to clipboard');
        toast(`Link Copied , You can share with people to start booking !`)
      })
      .catch((err) => {
        console.error('Unable to copy meeting link to clipboard', err);
      });
  };

  const getlink = async () => {
    try {
      const mail = appex?.Email;
      console.log("Mail", mail);

      console.log("Getlinks function -->", mail);

      const response = await fetch('https://evently-m4zq.onrender.com'+'/get_events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Email: mail
        })
      })
      if (response) {
        const meeting_ID = await response.json();
        console.log("Meeting Id : ", meeting_ID.ID.link);

        setEventName(meeting_ID.ID.event_name);
        setMeetingLink(meeting_ID.ID.link);

      }
    } catch (error) {
      console.log("error fething the link ");

    }

  }

  useEffect(() => {
    allbookings();
    getlink();
  }, [appex?.Email])

  // ************************************ Get all bookings **************************************

  async function allbookings() {
    const mail = appex?.Email;
    const response = await fetch('https://evently-m4zq.onrender.com'+'/collect_book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Email: mail
      })
    });
    if (response) {
      const bookingData = await response.json();
      console.log("Booking details : ", bookingData.details);
      const formattedBookings = bookingData.details.map((booking: any) => ({
        link: booking.link,
        booker: booking.booker,
        host: booking.host,
        users: booking.users,
        video_chat: booking.video_chat,
        date: booking.date,
        time: booking.time
      }));
      setbook(formattedBookings);
    } else {
      console.log("error fetching the bookings");
    }
  }

  const joinMeeting = (event: React.FormEvent<HTMLFormElement>, selectedBooking: book_face) => {
    event.preventDefault();
    console.log('Selected Booking:', selectedBooking);
    console.log("appex?.Email", appex?.Email);

    console.log("appex?.Email === selectedBooking.host", appex?.Email, selectedBooking.host);
    if (appex?.Email == selectedBooking.host) {
      console.log("If conditioin run");

      socex?.handleroom(selectedBooking.host, selectedBooking.video_chat)
      socex?.handleCallUser();
      socex?.sethostName(selectedBooking.host);
    } else {
      if (socex?.hostpresent == true) {
        socex?.handleroom(selectedBooking.users, selectedBooking.video_chat)
        socex?.sendStreams();
      } else {
        sethostab(true)
      }
    }
  };

  const HandleDelete = async (host : any  ,users  : any, video_chat  : any ,  date : any  , time : any) => {
    try {
      console.log("Data" ,host  ,users , video_chat  ,  date  , time);
      
      const response = await fetch('https://evently-m4zq.onrender.com'+'/delbooking', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          host  ,
          users , 
          video_chat   ,  
          date  , 
          time
        
        }),
      });

      if (response) {
      const data = await response.json();
        console.log(data);
        toast("Deleted Successfully")
        allbookings();
      } else {
        console.log("Error deleting the req");
        
      }
    } catch (error) {
      console.error("Error during delete operation:", error);
    }
  }

  useEffect(() => {
    if (socex?.hostpresent == true) {
      toast(`Host present in the room . Please Join !`)
    }
  }, [socex?.hostpresent])


  return (
    <div className='h-screen bg-cover' style={{ backgroundImage: `url(${image})` }}>

      <div className='flex justify-between'>

        <ToastContainer autoClose={false} theme="light" className='w-full md:w-1/2 mt-32 md:mt-40' />

        <div className='flex flex-row justify-between w-full h-full mt-40 '>
          <div className='hidden  md:flex flex-col md:w-1/5 border-4 min-h-96 rounded-r-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300'>

            <Link className='mt-32 text-md text-gray-600 font-semibold ml-8 p-1 hover:cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-105 flex flex-row' to="/Home">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>

              <p className='ml-5 font-custom'> Dashboard </p>
            </Link>

            <Link className='mt-4 text-md text-gray-600 font-semibold ml-8 p-1 hover:cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-105 flex flex-row' to="/Events">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-calendar-check-2"><path d="M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="m16 20 2 2 4-4" /></svg>
              <p className='ml-5 font-custom'>Add Events</p>
            </Link>

            <Link className='mt-4 text-md text-gray-600 font-semibold ml-8 p-1 hover:cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-105 flex flex-row' to="/premium">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-wallet"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
              <p className='ml-5 font-custom'> Buy Premium </p>
            </Link>

            <Link className='mt-4 text-md text-gray-600 font-semibold ml-8 p-1 hover:cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-105 flex flex-row' to="/">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
              <p className='ml-5 font-custom'> Home </p>
            </Link>

          </div>

          <div className='flex flex-col w-full md:w-3/4'>
            {MeetingLink ? (
              <div className='flex flex-col justify-between items-center mb-16 bg-gray-100'>
                <p className='font-semibold'>Share This Link with people to book the meeting</p>
                <div className='mt-2 h-28 md:h-12 w-3/4 flex flex-col md:flex-row justify-evenly items-center rounded-full text-center shadow-lg bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300'>
                  <p className='md:flex h-20 w-80 md:w-full md:mt-12 justify-center text-center mt-2 overflow-auto'> {MeetingLink}</p>
                  <button className='mr-4 hover:cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-110' onClick={copyToClipboard}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-copy">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className='flex flex-col justify-between items-center '>
                <p className='mt-2 '>Add events now and get Link to book meetings</p>
                <Link to='/Events'>
                  <button className='mt-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400'>Add Events</button>
                </Link>
              </div>
            )}
            <h1 className='font-semibold text-3xl text-center md:ml-0 ml-12'>Upcomming Booked Meetings</h1>

            {book.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 overflow-y-scroll max-h-96'>
                {book.map((booking, index) => (
                  <div key={index} className='md:ml-0 ml-5 w-4/5 h-4/5 custom-rounded shadow-lg shadow-slate-600 flex bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 p-2 mt-10'>
                    <div className='flex flex-col'>
                      <div className='flex flex-row justify-center'>
                        <div className='font-custom font-semibold flex justify-center items-center text-md w-[95%] text-slate-500'>
                          {Eventname}
                        </div>
                        <button className='hover:cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-105' onClick={() => {HandleDelete(booking.host , booking.users, booking.video_chat , booking.date ,booking.time)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>
                      </div>
                      <div className='flex flex-row justify-between'>
                        <div className='text-4xl text-left mt-16 text-white font-custom font-extrabold'>
                          {booking.date.slice(0, -5)}
                        </div>
                        <div className='mr-10'>
                          <div className='flex flex-col items-center p-2 text-md text-white'>
                            <p>Meeting Booked by </p>
                            <p className='font-semibold text-black'> {booking.booker}</p>
                          </div>
                          <div className='flex flex-row p-1 text-sm font-semibold text-white'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-mail-plus">
                              <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" />
                              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                              <path d="M19 16v6" />
                              <path d="M16 19h6" />
                            </svg>
                            <p className='ml-2'>{booking.users}</p>
                          </div>
                          <div className='flex flex-row p-1 text-sm text-white'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-calendar-days">
                              <path d="M8 2v4" />
                              <path d="M16 2v4" />
                              <rect width="18" height="18" x="3" y="4" rx="2" />
                              <path d="M3 10h18" />
                              <path d="M8 14h.01" />
                              <path d="M12 14h.01" />
                              <path d="M16 14h.01" />
                              <path d="M8 18h.01" />
                              <path d="M12 18h.01" />
                              <path d="M16 18h.01" />
                            </svg>
                            <p className='ml-2'> {booking.date}</p>
                          </div>
                          <div className='flex flex-row p-1 text-sm text-white'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-clock">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <p className='ml-2'> {booking.time}</p>
                          </div>
                        </div>
                      </div>

                      <div className=' w-80 flex justify-center items-center mt-6 text-white'>

                        <button onClick={handleOpenPopup} type="submit" className='w-44 h-10 rounded-sm flex flex-row bg-green-700 hover:bg-blue-800 hover:cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-105'>
                          <div className='mt-2 ml-4 font-semibold'>Get Details</div>
                        </button>
                      </div>
                    </div>
                    {isPopupOpen && (
                      <div className="fixed inset-0 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none">
                        <div className="relative flex flex-col justify-center items-center w-full max-w-md p-6 mx-auto bg-white rounded-md shadow-lg">
                          <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
                          <div className="flex-col items-center">
                            <div className='flex flex-row justify-between items-center'>
                              <p className='font-bold'>Booked By    : </p>
                              <p className='w-1/2 text-center'>{booking.booker}</p>
                            </div>
                            <div className='mt-2 flex flex-row justify-between items-center'>
                              <p className='font-bold w-1/2'>Participants : </p>
                              <p className='w-1/2 text-center'>{booking.users} , {booking.host}</p>
                            </div>
                            <div className='mt-2 flex flex-row justify-between items-center'>
                              <p className='font-bold w-1/2'>Time   : </p>
                              <p className='w-1/2 text-center'> {booking.time}</p>
                            </div>
                            <div className='mt-2 flex flex-row justify-between items-center'>
                              <p className='font-bold'>Meeting Link :  </p>
                              <p className='w-1/2 text-center text-slate-500'>{booking.link}</p>
                            </div>

                          </div>
                          <div className=' w-80 flex justify-center items-center mt-4 text-white'>
                            <form onSubmit={(e) => joinMeeting(e, booking)}>
                              <button type="submit" className='w-44 h-10 rounded-sm flex flex-row bg-blue-600 hover:bg-blue-800 hover:cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-105'>
                                <div className='mt-2 ml-4 font-semibold'>Join Meeting</div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide mt-1 ml-1 mr-2 lucide-video">
                                  <path d="m22 8-6 4 6 4V8Z" />
                                  <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
                                </svg>
                              </button>
                            </form>
                          </div>
                          <button
                            onClick={handleClosePopup}
                            className="mt-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}

                    {hostab && (
                      <div className="fixed inset-0 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none bg-opacity-50 backdrop-blur">
                        <div className="relative flex flex-col items-center justify-center w-full max-w-md p-6 mx-auto bg-white rounded-md shadow-lg">
                          <h2 className="text-lg text-cyan-900 font-semibold mb-4">MEETING NOT YET STARTED</h2>
                          <div className="text-md font-semibold flex justify-center">
                            Please wait till the host create the room
                          </div>
                          <button
                            onClick={hostpr}
                            className="mt-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400">
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className='mt-8 justify-center items-center flex'>
                <p>No Bookings yet</p>
              </div>
            )}



          </div>

        </div>
      </div>
    </div>
  )
}

export default Home
