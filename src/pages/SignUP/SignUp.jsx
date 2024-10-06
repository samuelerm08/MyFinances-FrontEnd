import { Link, useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";
import { useState } from "react";
import Alert from "../../components/Alert";
import { register } from "../../services/myfinances-api/user";
import { textsReGex } from "../../constants/MyFinancesConstants";
import { HttpStatusCode } from "axios";

const SignUp = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        if ([firstName, lastName, email, password, repeatPassword].includes("")) {
            setLoading(false);
            setAlert({
                msg: "All fields are required!",
                error: true
            });
            return;
        }

        if (password !== repeatPassword) {
            setLoading(false);
            setAlert({
                msg: "Passwords doesn't match",
                error: true
            });
            return;
        }

        setAlert({});

        try {
            const { status } = await register({ firstName, lastName, email, isAdmin: false, password });
            if (status === HttpStatusCode.Created) {
                setLoading(false);
                setAlert({
                    msg: "User created. Redirecting to login page...",
                    error: false
                });
                setTimeout(() => {
                    navigate("/");
                }, 3000);
                setFirstName("");
                setLastName("");
                setEmail("");
                setPassword("");
                setRepeatPassword("");
            }
        } catch (error) {
            setLoading(false);
            setAlert({
                msg: error.response.data,
                error: true
            });
            setTimeout(() => {
                setAlert({});
            }, 5000);
        }
    };
    const { msg } = alert;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}> Welcome to
                <span className={styles.span}> MyFinances</span>
            </h1>

            <form
                className={styles.form}
                onSubmit={handleSubmit}
            >
                <div>
                    <label className={styles.label}
                        htmlFor="firstName"
                    >First Name</label>
                    <input
                        id="firstName"
                        type="firstName"
                        placeholder="First Name"
                        maxLength={30}
                        className={styles.input}
                        value={firstName}
                        onChange={e => {
                            if (textsReGex.test(e.target.value) || e.target.value === "") {
                                setFirstName(e.target.value);
                            }
                        }}
                    />

                </div>
                <div>
                    <label className={styles.label}
                        htmlFor="lastName"
                    >Last Name</label>
                    <input
                        id="lastName"
                        type="text"
                        placeholder="Last Name"
                        maxLength={30}
                        className={styles.input}
                        value={lastName}
                        onChange={e => {
                            if (textsReGex.test(e.target.value) || e.target.value === "") {
                                setLastName(e.target.value);
                            }
                        }}
                    />

                </div>
                <div>
                    <label className={styles.label}
                        htmlFor='email'
                    >Email</label>
                    <input
                        id='email'
                        type='email'
                        placeholder='Email'
                        className={styles.input}
                        maxLength={30}
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

                <div>
                    <label className={styles.label}
                        htmlFor='repeatPassword'
                    >Repeat Password</label>
                    <input
                        id='passwordRep'
                        type='password'
                        placeholder='Repeat Password'
                        className={styles.input}
                        value={repeatPassword}
                        onChange={e => setRepeatPassword(e.target.value)}
                    />
                </div>

                <div
                    className={styles.submit}
                >
                    <input
                        className={`${styles.button}`}
                        type="submit"
                        value={!loading ? "Sign up" : "Signing up..."}
                        disabled={loading}
                    />
                </div>
                {msg && <Alert alert={alert} />}
            </form>
            <div className={styles.nav}>
                <nav>
                    <p>
                        Have an account?
                    </p>
                    <Link className={styles.link} to="/">
                        Log in
                    </Link>
                </nav>
            </div>
        </div>
    );
};

export default SignUp;