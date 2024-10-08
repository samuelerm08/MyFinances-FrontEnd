import { Navigate, Outlet } from "react-router-dom";
import styles from "../styles/ProtectedPath.module.css";
import Header from "../components/header/Header";
import useAuth from "../context/UseAuth";
import { Footer } from "../components/footer/Footer";


const ProtectedPath = () => {

    const { auth, loading } = useAuth();
    if (loading) return "Cargando...";

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
                        <footer>
                            <Footer />
                        </footer>
                    </div>
                    : <Navigate to="/" />
            }
        </>
    );
};

export default ProtectedPath;