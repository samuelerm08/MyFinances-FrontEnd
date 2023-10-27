<<<<<<< HEAD
import React, { useContext } from 'react'
=======
>>>>>>> 3c8cc4c27f653d5d75f20b1bf8172eedfe55d220
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import styles from '../styles/ProtectedPath.module.css' 
import useAuth from "../hooks/useAuth"
<<<<<<< HEAD
import AuthContext from '../context/AuthProvider'
=======
import jwt_decode from "jwt-decode";
import { useEffect } from 'react'

>>>>>>> 3c8cc4c27f653d5d75f20b1bf8172eedfe55d220


const ProtectedPath = () => {

<<<<<<< HEAD
  
  const { auth, cargando } = useContext(AuthContext)
=======
  // Obtén el token del localStorage
  const token = localStorage.getItem('token'); 
  const navigate = useNavigate()
  const { cargando } = useAuth()
  

  //TODO: Uso este if para poder seguir trabajando en dashboard. Hay que solucionar el bug 101
  if(!token) {
    console.log('no existe token')
    navigate('/')
  }
  
  const { auth } = useAuth()
>>>>>>> 3c8cc4c27f653d5d75f20b1bf8172eedfe55d220
  // TODO: usar un spinner
  if(cargando) return 'Cargando...'
  
  
  return (

    // Si existe auth.id Ingresa a dashboard por medio de ProtectedPath (ver el navegate to Dashboard en App.jsx)
    <>  
        {
        auth ?
        (
          <div className={styles.container}>     
                   
            <div className={styles.menu}>
              <Sidebar />
            </div>
            
            <div className={styles.mainContainer}>
              <div className={styles.headerContainer}>
                <Header />
              </div>  

              <main>
                <Outlet />
              </main>
            </div>
            

        </div>
       
        )
        :
          (
            <Navigate to="/" />             
          )
        }
  
        
    </>
  )
}

export default ProtectedPath