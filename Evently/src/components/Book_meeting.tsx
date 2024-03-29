import React, { useEffect, useState ,useContext } from 'react'
import AppContext from '../Context_api/user.context'
import { Link, useParams , useNavigate } from 'react-router-dom'
import images from '../assets/images.png'
import image from '../assets/back-transformed.jpeg'
import { ToastContainer, toast } from 'react-toastify'


import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';


const Book_meeting: React.FC = () => {

    interface repository {
        link: string ;
        booker : string ;
        host: string ;
        users: string ;
        video_chat: string;
        date: string ;
        time: string ;
    }

    const navigate = useNavigate()
    const appex = useContext(AppContext)

    const [booking_success , setbooking_success] =useState<boolean>(false)
    const [date, setdate] = useState('');
    const [availableWeekdays, setAvailableWeekdays] = useState<string[]>([]);
    const [startTime, setStartime] = useState('10:00');
    const [data, setdata] = useState({
        Email: '',
        booker : '',
        link: '',
        time_start: '',
        time_end: '',
        event_name: '',
        days_selected: [],
        duration: 30
    });
    const [repo, setrepo] = useState<repository>({
        link: '',
        booker: '',
        host: '',
        users: '',
        video_chat: '',
        date: '',
        time: ''
    })


    const { username, category, meetingId } = useParams();

    const starttimeChange = (value: string) => {
        setStartime(value);
    };

    useEffect(() => {
        const url = window.location.pathname;
        // console.log("THe url" , url);

        appex?.seturl(url);
        appex?.setBookingState(true);
    }, [])

    const fetch_events = async () => {
        const event_details = await fetch('https://evently-m4zq.onrender.com'+'/book_events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                link: window.location.href
            })
        })
        const events = await event_details.json();
        console.log("Event-details : ", events);
        setAvailableWeekdays(events.ID.days_selected)
        setdata({
        Email: events.ID.email,
        booker : events.ID.booker,
        link: events.ID.link,
        time_start: events.ID.time_start,
        time_end: events.ID.time_end,
        event_name: events.ID.event_name,
        days_selected: events.ID.days_selected,
        duration: events.ID.duration
        })
    }

    useEffect(() => {
        if (appex?.loginState) {
            fetch_events();
        }
    }, [appex?.loginState])

    const onChange = (value: Date | Date[]) => {
        // Handle calendar value change
        const selectedDate = value instanceof Date ? value : value[0]; // Handle cases where value is an array
        const formattedDate = selectedDate.toLocaleDateString('en-IN'); // Adjust the locale as needed
    
        console.log('Selected date:', formattedDate);
        setdate(formattedDate);
    };
    
    useEffect(() => {

        const chat = `https://evently-nu-eight.vercel.app/meet_link/${category}/${meetingId}`
        setrepo(prevuser => ({
            ...prevuser,
            link: data.link,
            booker : appex?.Name,
            host: data.Email,
            users: appex?.Email,
            video_chat: chat,
            date: date,
            time: startTime
        }))

    }, [date, startTime , data , appex])

    const confirmBooking = async () => {
        const { link,booker, host, users, video_chat, date, time } = repo;
        console.log("data sending : ", link,booker, host, users, video_chat, date, time);

        const response = await fetch('https://evently-m4zq.onrender.com'+'/booking_success', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                link,
                booker,
                host,
                users,
                video_chat,
                date,
                time

            })
        })
        if (response.ok) {
            console.log("Meeting successfully booked");
            setbooking_success(true)
        }else{
            toast("Meeting Already Available for the selected Date and Time !");
        }
    }

    const tileDisabled = ({ date }: { date: Date; }) => {
       
        // Enable only the weekdays available in the database
        if (availableWeekdays.length > 0) {
            const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
            if (!availableWeekdays.includes(weekday)) return true;
        }

        return false;
    };


    return (
        <div className='h-screen bg-cover ' style={{ backgroundImage: `url(${image})` }}>
            {appex?.loginState ? <div>
                <div className='flex flex-col justify-center items-center'>
      <ToastContainer className='w-full md:w-1/2 mt-32 md:mt-40' />

                    <div className=' mt-40 bg-gray-100 font-semibold text-3xl flex justify-center items-center'>
                        Book a meeting with {username} - {category}
                    </div>
                    <h4 className='text-slate-500 text-md text-center md:ml-0 ml-12 bg-gray-100'>Select date and time for the meeting and we will set the tables </h4>
                    <div className='mt-12 md:ml-0 ml-16 shadow-sm w-full md:w-3/5 md:h-3/4 flex md:flex-row flex-col justify-center p-4'>

                        <div className='mr-20 shadow-lg'>
                            <Calendar
                                calendarType='gregory'
                                className='shadow-2xl rounded-lg border-2 border-black p-4'
                                onChange={onChange}
                                value={date}
                                minDate={new Date()}
                                tileDisabled={tileDisabled}
                            />
                        </div>
                        <div className='flex flex-col md:mb-12 items-center justify-evenly'>
                            <p className='font-semibold text-xl'> what time works best for you ?</p>
                            <p className=''>Preffered Time Slot for {username} - {data.time_start} to {data.time_end} </p>
                            <div className='w-40 overflow-hidden '><TimePicker className='border-2 border-black rounder-full shadow-lg' onChange={starttimeChange} value={startTime} /></div>
                        </div>
                    </div>
                    <div className='w-3/4 flex md:justify-end justify-center mt-12'>
                        <div onClick={confirmBooking} className='w-32 h-10 md:mr-20 flex justify-center bg-blue-500 rounded-lg shadow-lg hover:bg-blue-700'>
                            <button className='text-white font-semibold '>Next</button>
                        </div>
                    </div>
                </div>
                {booking_success && (
                            <div className="fixed inset-0 border-2 border-green-500 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none bg-opacity-50 backdrop-blur">
                                <div className="flex flex-col justify-center items-center relative w-fullmax-w-3/5 p-6 mx-auto bg-white rounded-md shadow-lg">
                                <img className='h-40 w-40 rounded-full' src={images} alt="success_booking" />
                                    <h2 className="text-lg font-semibold text-center mb-4">Meeting successfully booked with {username}</h2>
                                    <h3 className="text-md text-slate-500 font-semibold text-center mb-4">Check your e-mail for the meeting link and other details</h3>
                                    <div className=" text-center">
                                        <p>{}</p>
                                    </div>
                                    <button
                                        onClick={()=>navigate('/home')}
                                        className="mt-4  bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                    
                )}
            </div> : <div>
                <div className='flex flex-col justify-center items-center'>
                    <p className='mt-80 text-4xl font-semibold text-center'>Please Sign-In to Continue . . .</p>
                    <Link to='/signIn'>
                        <button className='mt-10 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 text-gray-800 font-semibold py-2 px-4 rounded-full hover:bg-gray-400 hover:cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-105'>Sign-In</button>
                    </Link>
                </div>
            </div>

            }

        </div>
    )
}

export default Book_meeting
