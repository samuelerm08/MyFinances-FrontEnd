import { useState } from "react";
import styles from "./Login.module.css";
import Alert from "../../components/Alert";
import { Link, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { setUserToken } from "../../services/token/tokenService";
import useAuth from "../../context/useAuth";
import { login } from "../../services/myfinances-api/user";
import { HttpStatusCode } from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setContraseña] = useState("");
    const [alert, setAlerta] = useState({});
    const [loading, setCargando] = useState(true);
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        setCargando(false);
        /* Validación de campos */
        if ([email, password].includes("")) {
            setAlerta({
                msg: "Todos los campos son obligatorios",
                error: true
            });
            setTimeout(() => {
                setAlerta({});
            }, 5000);

            setCargando(true);
        }
        else {
            try {
                const { data, status } = await login({ email, password });
                if (status === HttpStatusCode.Ok) {
                    setUserToken("token", data.token);
                    setAuth(data.token);
                    setUserToken("user", JSON.stringify(jwtDecode(data.token)));
                    navigate("/dashboard/index");
                }
            } catch (error) {
                console.log(error);
                setAlerta({
                    msg: error.response.data,
                    error: true
                });
                setTimeout(() => {
                    setAlerta({});
                }, 5000);
                setCargando(true);
            }
        }
    };
    const { msg } = alert;

    return (
        <div className={styles.container}>
            <div className="flex justify-center">
                <div className="text-center p-5 m-5 w-20 rounded-3xl bg-violet-400">
                    <i className="fa-solid fa-dragon"></i>
                </div>
            </div>
            <span className={styles.span}>Bienvenido a My Finances</span>
            <h1 className={styles.title}>Inicia sesión</h1>

            <form
                className={styles.form}
                onSubmit={handleSubmit}
            >
                <div>
                    <label className={styles.label}
                        htmlFor='email'
                    >Correo Electrónico</label>
                    <input
                        id='email'
                        type='email'
                        placeholder='Correo Electrónico'
                        className={styles.input}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label className={styles.label}
                        htmlFor='password'
                    >Contraseña</label>
                    <input
                        id='password'
                        type='password'
                        placeholder='Contraseña'
                        className={styles.input}
                        value={password}
                        onChange={e => setContraseña(e.target.value)}
                    />

                </div>

                <div
                    className={styles.submit}
                >
                    <input
                        className={styles.button}
                        type="submit"
                        value={!loading ? "Ingresando..." : "Ingresar"}
                        disabled={!loading}
                    />
                </div>
                {msg && <Alert alert={alert} />}
            </form>

            <div className={styles.nav}>
                <nav>
                    <p>
                        ¿Aún no tienes tu cuenta?
                    </p>
                    <Link
                        className={styles.link} to="/signup">
                        Regístrate
                    </Link>
                </nav>
            </div>
        </div>
    );
};
export default Login;