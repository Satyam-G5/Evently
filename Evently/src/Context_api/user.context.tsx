import React, { createContext, useState, ReactNode, useEffect  } from 'react';


// Define the context type
interface AppContextType {
    loginState: boolean | undefined;
    token: string | undefined;
    newuser : any ;
    Name :any;
    changeLoginState: (login: boolean) => void;
    changeToken: (newtoken: string) => void;
    getuser_details: () => void;
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
    // interface conMem {
    //        cID : string ;
    //     SenderID : string ;
    //     RecieverID : string ;
    // }

    const [loginState, setLoginState] = useState<boolean | undefined>();
    const [token, setToken] = useState<string | undefined>();
    const [newuser, setNewuser] = useState<userType>()
    const [Name , setName] = useState<string>('')
   


    const changeLoginState = (login: boolean) => {
        setLoginState(login);
    };

    const changeToken = (newtoken: string) => {
        setToken(newtoken);
    };

    const getuser_details = async () => {
        if (token) {
            try {
                

                const response = await fetch("/get_user", {
                    method: "GET",
                    headers: {
                        'content-type': 'application/json',
                        'accept': 'application/json',
                        "Authorization": `${token}`
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

  

    useEffect(() => {
        getuser_details();
       
    }, [token]);

    useEffect(() => {  /// take care of the login-user and token storage 
        if (newuser) {
            localStorage.setItem('newuser', JSON.stringify(newuser));
            setName(newuser.firstname)
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
        changeLoginState,
        changeToken,
        getuser_details,
    };

    return <AppContext.Provider value={contextValue}>
        {children}
    </AppContext.Provider>;
};

export default AppContext;
