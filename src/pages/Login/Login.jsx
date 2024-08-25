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
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState({});
    const [loading, setLoading] = useState(true);
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(false);
        if ([email, password].includes("")) {
            setAlert({
                msg: "All fields are required!",
                error: true
            });
            setTimeout(() => {
                setAlert({});
            }, 5000);

            setLoading(true);
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
                setAlert({
                    msg: error.response.data,
                    error: true
                });
                setTimeout(() => {
                    setAlert({});
                }, 5000);
                setLoading(true);
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
            <span className={styles.span}>Welcome to MyFinances</span>
            <h1 className={styles.title}>Login</h1>

            <form
                className={styles.form}
                onSubmit={handleSubmit}
            >
                <div>
                    <label className={styles.label}
                        htmlFor='email'
                    >Email</label>
                    <input
                        id='email'
                        type='email'
                        placeholder='Email'
                        className={styles.input}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label className={styles.label}
                        htmlFor='password'
                    >Password</label>
                    <input
                        id='password'
                        type='password'
                        placeholder='Password'
                        className={styles.input}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                </div>

                <div
                    className={styles.submit}
                >
                    <input
                        className={styles.button}
                        type="submit"
                        value={!loading ? "Loading..." : "Login"}
                        disabled={!loading}
                    />
                </div>
                {msg && <Alert alert={alert} />}
            </form>

            <div className={styles.nav}>
                <nav>
                    <p>
                        Don't have an account?
                    </p>
                    <Link
                        className={styles.link} to="/signup">
                        Sign up
                    </Link>
                </nav>
            </div>
        </div>
    );
};
export default Login;