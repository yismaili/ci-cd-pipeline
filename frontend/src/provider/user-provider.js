import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate} from 'react-router-dom'
import axios from 'axios'
import { api } from "../lib/api";

const UserContext = createContext({
    user: null,
    loading: false,
    refresh: () => {}
})


export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
   const [loading, setLoading] = useState(true) 
   const location = useLocation()
    const navigate = useNavigate();
   
    const publicRoutes = ['/', '/login', '/signin']

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true) 
                const { data } = await api.get('/users/profile');
                if (data) setUser(data);
            } catch (e) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        fetchUser();
    }, []);
   
    
    useEffect(() => {
        if (loading) return;
        if (!user && !publicRoutes.includes(location.pathname)) {
           navigate('/login') 
        }
        if (user && publicRoutes.includes(location.pathname)) {
           navigate('/profile') 
        }
    }, [user, loading, location])

    return <UserContext.Provider value={{ user, loading }}>{children}</UserContext.Provider>
}


export const useUser = () => useContext(UserContext);