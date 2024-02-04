import { Outlet } from "react-router-dom";
import styles from "../styles/AuthLayout.module.css";

const AuthLayout = () => {
    return (
        <main className={styles.container}>
            <Outlet />
        </main>
    );
};

export default AuthLayout;