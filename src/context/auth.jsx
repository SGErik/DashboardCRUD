import React, { createContext, useEffect, useState } from 'react'
import { api, authUsers } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useToaster, Message } from 'rsuite';


export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    let message = null;
    const navigate = useNavigate()
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)
    const [messageError, setMessageError] = useState('')

    
    
    useEffect(()=> {
        const recoveredUser = localStorage.getItem('user')

        if(recoveredUser){
            setUser(JSON.parse(recoveredUser))
        }

        setLoading(false)
    }, [])
    
    
    
    
    const login = async (email, password)=> {
        const response = await authUsers(email, password)
        
        try{

        

        const loggedUser = response.data.user;
        const token = response.data.token;

        localStorage.setItem('user', JSON.stringify(loggedUser));
        localStorage.setItem('token', token);

        api.defaults.headers.Authorization = `Bearer ${token}`;

        setUser(loggedUser)
        navigate('/home')
        }catch(error) {
            if(error.response.status === 400){
                console.log('Oi')
                setMessageError(response.data.message)
            }
        }
            
            

    };

    const logout = ()=> {
        setUser(null);
        localStorage.clear()

        api.defaults.headers.Authorization = null ;
        
        navigate('/login')

    };

    return(
        <AuthContext.Provider value={{authenticated: !!user, user, loading, login, logout, messageError}}>
            {children}
        </AuthContext.Provider>
    )
}

