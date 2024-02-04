import { Navigate, Outlet } from "react-router-dom";
import styles from "../styles/ProtectedPath.module.css";
import Header from "../components/header/Header";
import useAuth from "../context/useAuth";


const ProtectedPath = () => {

    const { auth, cargando } = useAuth();
    if (cargando) return "Cargando...";

    return (
        <>
            {
                auth ?
                    <div className={styles.container}>
                        <div className={styles.headerContainer}>
                            <Header />
                        </div>
                        <main className={styles.mainSinHeader}>
                            <Outlet />
                        </main>
                    </div>
                    : <Navigate to="/" />
            }
        </>
    );
};

export default ProtectedPath;