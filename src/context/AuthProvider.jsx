import { createContext, useEffect, useState } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";


//creo el AuthContext y lo utilizo en otros lugares
const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({})
    const [cargando, setCargando] = useState(true)

    const navigate = useNavigate()

    /* este useEffect se ejecuta una sola vez para comprobar si hay token*/
    useEffect(() => {
        const autenticarUsuario = () => {
        //TODO: Preguntar a Emilio si aca tengo que invocar el useFetch para no hacer todo esto

            const token = localStorage.getItem('token')
            
            if(!token){
                setCargando(false)
                setAuth(false)
                return
            }

            // Para pasar el bearer token
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                setAuth(token)
                //TODO: Ruta a perfil económico           
                navigate('/dashboard')

            } catch (error) {
                console.log(error)
                setAuth({})
            }

            setCargando(false)
        }
        autenticarUsuario()

    }, [])

    return(
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando
            }}
        >

            {children}
        </AuthContext.Provider>

    )
}

export {
    AuthProvider
}

export default AuthContext;