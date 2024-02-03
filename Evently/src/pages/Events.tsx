import { useState, useContext, useEffect } from 'react'
import React from 'react'
import { Link} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import AppContext from '../Context_api/user.context';

import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';


const Events: React.FC = () => {

    

    const appex = useContext(AppContext);

    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [isNewPopupOpen, setIsNewPopupOpen] = useState<boolean>(false);
    const [meetingDuration, setMeetingDuration] = useState(30);
    const [selectedDays, setSelectedDays] = useState([]);
    const [startTime, setStartime] = useState('10:00');
    const [endTime, setendtime] = useState('17:00');
    const [showlink, setshowlink] = useState<boolean>(false);
    const [EventLink, setEventLink] = useState<string>('');
    const [eventname , seteventname] = useState<string>('')
    const [data , setdata] = useState({
        Email : '',
        link : '',
        time_start : '', 
        time_end : '',
        event_name : '',
        days_selected : [],
        duration : 30
    });


    const starttimeChange = (value: string) => {
        setStartime(value);
    };

    const endtimeChange = (value: string) => {
        setendtime(value);
    };

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleNewOpenPopup = () => {
        setIsNewPopupOpen(true);
    };

    const handleNewClosePopup = () => {
        setIsNewPopupOpen(false);
    };
    
    const nameevent = (event: React.ChangeEvent<HTMLInputElement>) => {
        seteventname(event.target.value);
    }

    // ***************************************************************************************************

    const handleSelectDuration = (duration: any) => {
        setMeetingDuration(duration);
        handleClosePopup();
    };

    const handleSelectDay = (day: any) => {
        // Toggle the selected day in the array
        setSelectedDays((prevSelectedDays: any) => {
            if (prevSelectedDays.includes(day)) {
                return prevSelectedDays.filter((selectedDay: any) => selectedDay !== day);
            } else {
                return [...prevSelectedDays, day];
            }
        });
    };
    // ******************************** SEND DATE TO BACKEND ***************************************

    const send_data = async () => {
        const {Email , link, time_start, time_end, event_name,days_selected, duration } = data ;
        console.log("Data Sending : ",Email, link, time_start, time_end, event_name,days_selected, duration );
        
        try {
            const response = await fetch('/save_events' , {
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    Email,
                    link, 
                    time_start,
                    time_end,
                    event_name,
                    days_selected,
                    duration
                })
            })
    
            if(response){
                console.log("Data saved to data base : " , response);
            }else{
                console.log("Data not saved");    
            }
        } catch (error) {
            console.log("try Failed : ", error);
            
        }
    }
    
    // *************************** HANDLE MEETING-LINK HOST *****************************************

    const generateMeetingId = (): string => {
        // Use uuidv4 to generate a unique ID 
        return uuidv4();
    };

    const generateMeetingLink =  async () => {
        // Generate the meeting ID
        const meetingId = generateMeetingId();

        // Construct the meeting link
        const Link = `http://localhost:5173/booking/${appex?.Name}/${eventname}/${meetingId}`;
        console.log("Link Generated --> ", Link);
        setEventLink(Link)
        setshowlink(true)

        send_data() ;
    };
    useEffect(()=>{
        setdata({
            Email : appex?.Email,
            link : EventLink ,
            time_start : startTime, 
            time_end : endTime,
            event_name : eventname,
            days_selected : selectedDays, 
            duration : meetingDuration
        })
    }, [EventLink, appex , startTime ,endTime ,eventname ,selectedDays ,meetingDuration , showlink])


    const closeLink = () => {
        setshowlink(false);
    }

    return (
        <div className='flex justify-between mt-32'>
            <div className='flex flex-row justify-between w-full h-full'>
                <div className='hidden md:flex flex-col md:w-1/5 border-4 min-h-96 border-x-black border-y-white'>

                    <Link className='mt-4 text-md text-gray-600 font-semibold ml-8 p-1 hover:cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-105 flex flex-row' to="/Home">
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

                <div className='flex flex-col md:w-3/4'>
                    <h1 className='font-semibold text-xl text-center md:ml-0 ml-12 md:mr-24'>Add/Create/Edit Events</h1>
                    <h4 className='text-slate-400 text-md text-center md:ml-0 ml-12 md:mr-24'>Add meeting duration and week days available for the meeting </h4>

                    <div className='flex flex-col '>

                        <div className='text-center mt-8 flex flex-row justify-between'>
                            <p className='mt-4 w-1/4 font-semibold'>Event Name :</p>
                            <div className='w-3/4 flex flex-col justify-center items-center'>
                                <input type="text"
                                    id='eventname'
                                    onChange={nameevent}
                                    className='mt-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-white '
                                    placeholder='Event Name' />
                            </div>
                        </div>

                        <div className="text-center mt-8 flex flex-row justify-between">
                            <p className='mt-4 w-1/4 font-semibold'>Select Meeting Duration :</p>
                            <div className='w-3/4 flex flex-col justify-center items-center'>

                                <p className="font-semibold"> Meeting Duration: {meetingDuration} minutes</p>

                                {isPopupOpen && (
                                    <div className="fixed inset-0 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none">
                                        <div className="relative w-full max-w-md p-6 mx-auto bg-white rounded-md shadow-lg">
                                            <h2 className="text-lg font-semibold mb-4">Select Meeting Duration</h2>
                                            <div className="flex justify-between">
                                                <button onClick={() => handleSelectDuration(15)} className="duration-button">
                                                    15 minutes
                                                </button>
                                                <button onClick={() => handleSelectDuration(30)} className="duration-button">
                                                    30 minutes
                                                </button>
                                                <button onClick={() => handleSelectDuration(45)} className="duration-button">
                                                    45 minutes
                                                </button>
                                                <button onClick={() => handleSelectDuration(60)} className="duration-button">
                                                    1 hour
                                                </button>
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
                                <button
                                    onClick={handleOpenPopup}
                                    className="bg-blue-500 text-white py-2 mt-2 px-4 rounded-full"
                                >
                                    Select Meeting Duration
                                </button>
                            </div>

                        </div>

                        <div className="text-center mt-12 flex flex-row justify-between">
                            <p className='mt-4 w-1/4 font-semibold'>Available week days :</p>
                            <div className='w-3/4 flex flex-col justify-center items-center'>
                                <p className="mt-4 font-semibold mb-2">{selectedDays.join(', ')}</p>

                                <button
                                    onClick={handleNewOpenPopup}
                                    className="bg-blue-500 text-white py-2 px-4 rounded-full"
                                >
                                    Select Available Weekdays
                                </button>


                                {isNewPopupOpen && (
                                    <div className="fixed inset-0 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none">
                                        <div className="relative w-full max-w-md p-6 mx-auto bg-white rounded-md shadow-lg">
                                            <h2 className="text-lg font-semibold mb-4">Select Available Weekdays</h2>
                                            <div className="flex flex-wrap justify-around">
                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday' , 'Saturday' , 'Sunday'].map((day: any) => (
                                                    <label key={day} className="inline-flex items-center m-2">
                                                        <input
                                                            type="checkbox"
                                                            // checked={selectedDays.includes(day)}
                                                            onChange={() => handleSelectDay(day)}
                                                            className="form-checkbox h-5 w-5 text-blue-600"
                                                        />
                                                        <span className="ml-2">{day}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <button
                                                onClick={handleNewClosePopup}
                                                className="mt-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                        <div className="text-center mt-12 flex flex-row justify-between">
                            <p className='mt-4 w-1/4 font-semibold'>Available Time slots :</p>

                            <div className='w-3/4 flex md:flex-row flex-col justify-center items-center'>
                                <div className='w-40 overflow-hidden '><TimePicker className='border-2 border-black rounder-full shadow-lg' onChange={starttimeChange} value={startTime} /></div>
                                <p className='md:mr-4 md:ml-4 md:mt-0 md:mb-0 mb-2 mt-2'>to</p>
                                <div className='w-40 overflow-hidden'><TimePicker className='border-2 border-black rounder-full shadow-lg' onChange={endtimeChange} value={endTime} /></div>
                            </div>
                        </div>
                        <div className='w-full flex md:justify-end justify-center mt-20'>
                            <div onClick={generateMeetingLink} className='w-32 h-10 md:mr-20 flex justify-center bg-blue-500 rounded-lg shadow-lg hover:bg-blue-700'>
                                <button className='text-white font-semibold '>Next</button>
                            </div>
                        </div>
                        {showlink && (
                            <div className="fixed inset-0 border-2 border-green-500 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none bg-opacity-50 backdrop-blur">
                                <div className="flex flex-col justify-center items-center relative w-fullmax-w-3/5 p-6 mx-auto bg-white rounded-md shadow-lg">
                                    <h2 className="text-lg font-semibold text-center mb-4">Invitation Link Generated</h2>
                                    <div className=" text-center">
                                        <p>{EventLink}</p>
                                    </div>
                                    <button
                                        onClick={closeLink}
                                        className="mt-4  bg-gray-300 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-400"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>


                </div>


            </div>
        </div>
    )
}

export default Events
