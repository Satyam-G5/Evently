import React, { createContext, useState, ReactNode, useEffect  } from 'react';
import Cookies from 'js-cookie';

// Define the context type
interface AppContextType {
    loginState: boolean | undefined;
    token: string | undefined;
    newuser : any ;
    Name :any;
    Email : any ;
    url : any ;
    seturl : any ;
    BookingState :any ;
    setBookingState :any;
    client : any ;
    changeLoginState: (login: boolean) => void;
    changeToken: (newtoken: string) => void;
    getuser_details: () => void;
    set_client : (get_key : any) => void ;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    

    interface userType {
        firstname  : string; 
        lastname : Number ;
        email : string ; 
        password : string ;
    }

    const [loginState, setLoginState] = useState<boolean>(false);
    const [token, setToken] = useState<string | undefined>();
    const [newuser, setNewuser] = useState<userType>();
    const [Name , setName] = useState<string>('');
    const [Email , setEmail] = useState<string>('');
    const [BookingState , setBookingState] = useState<boolean>(false)
    const [url  ,seturl] = useState();
    const [client , setclient] = useState();
   
    const set_client  =(get_key : any) => {
        setclient(get_key)
        console.log("client key : " , get_key);
        
    }

    const changeLoginState = (login: boolean) => {
        setLoginState(login);
    };

    const changeToken = (newtoken: string) => {
        setToken(newtoken);
    };

    const getuser_details = async () => {
        if (Cookies.get('token')) {
            const username = Cookies.get('token');
            setToken(username);
            setLoginState(true);
            console.log('User cookie exists!', username);
           
        if (token || username) {
            try {

                const response = await fetch('https://evently-m4zq.onrender.com'+'/get_user', {
                    method: "GET",
                    headers: {
                        'content-type': 'application/json',
                        'accept': 'application/json',
                        "Authorization": `${token || username}`
                    }
                })
                if (response.ok) {
                    const user_details = await response.json();
                    console.log(user_details.user);

                    setNewuser(prevUser => ({
                        ...prevUser,
                        firstname: user_details.user.firstname,
                        lastname : user_details.user.lastname ,
                        email: user_details.user.email,
                        password: user_details.user.password,
                    })); 

                }
                else {
                    console.log("response not recieved ")
                }
                
            } catch (error) {
                console.log("error Notice", error)
            }
        }
    }
    }

  

    useEffect(() => {
        getuser_details();
       
    }, [token]);

    useEffect(() => {  /// take care of the login-user and token storage 
        if (newuser) {
            localStorage.setItem('newuser', JSON.stringify(newuser));
            setName(newuser.firstname)
            setEmail(newuser.email)
        }
        if (token !== undefined) {
            localStorage.setItem('token', JSON.stringify(token));
        }
      
    }, [newuser , token ]);

  


    const contextValue: AppContextType = {
        loginState,
        token,
        newuser,
        Name,
        Email,
        BookingState , 
        url ,
        client,
        set_client,
        seturl,
        setBookingState,
        changeLoginState,
        changeToken,
        getuser_details,
    };

    return <AppContext.Provider value={contextValue}>
        {children}
    </AppContext.Provider>;
};

export default AppContext;
