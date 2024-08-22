import { Link, useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";
import { useState } from "react";
import Alert from "../../components/Alert";
import { register } from "../../services/myfinances-api/user";
import { textsReGex } from "../../constants/myfinances-constants";
import { HttpStatusCode } from "axios";

const SignUp = () => {
    const [firstName, setNombre] = useState("");
    const [lastName, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [contraseña, setPassword] = useState("");
    const [repetirPassword, setRepetirPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [alert, setAlerta] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        if ([firstName, lastName, email, contraseña, repetirPassword].includes("")) {
            setLoading(false);
            setAlerta({
                msg: "Todos los campos son obligatorios",
                error: true
            });
            return;
        }

        if (contraseña !== repetirPassword) {
            setLoading(false);
            setAlerta({
                msg: "No coinciden los password",
                error: true
            });
            return;
        }

        setAlerta({});

        try {
            const { status } = await register({ firstName, lastName, email, esAdmin: false, contraseña });
            if (status === HttpStatusCode.Created) {
                setLoading(false);
                setAlerta({
                    msg: "Usuario creado con éxito. Redirigiendo al inicio de sesión...",
                    error: false
                });
                setTimeout(() => {
                    navigate("/");
                }, 3000);
                setNombre("");
                setApellido("");
                setEmail("");
                setPassword("");
                setRepetirPassword("");
            }
        } catch (error) {
            setLoading(false);
            setAlerta({
                msg: error.response.data,
                error: true
            });
            setTimeout(() => {
                setAlerta({});
            }, 5000);
        }
    };
    const { msg } = alert;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}> Bienvenido a
                <span className={styles.span}> MyFinances</span>
            </h1>

            <form
                className={styles.form}
                onSubmit={handleSubmit}
            >
                <div>
                    <label className={styles.label}
                        htmlFor="firstName"
                    >Nombre</label>
                    <input
                        id="firstName"
                        type="firstName"
                        placeholder="Nombre"
                        maxLength={30}
                        className={styles.input}
                        value={firstName}
                        onChange={e => {
                            if (textsReGex.test(e.target.value) || e.target.value === "") {
                                setNombre(e.target.value);
                            }
                        }}
                    />

                </div>
                <div>
                    <label className={styles.label}
                        htmlFor="lastName"
                    >Apellido</label>
                    <input
                        id="lastName"
                        type="text"
                        placeholder="Apellido"
                        maxLength={30}
                        className={styles.input}
                        value={lastName}
                        onChange={e => {
                            if (textsReGex.test(e.target.value) || e.target.value === "") {
                                setApellido(e.target.value);
                            }
                        }}
                    />

                </div>
                <div>
                    <label className={styles.label}
                        htmlFor='email'
                    >Correo Electrónico</label>
                    <input
                        id='email'
                        type='email'
                        placeholder='Correo Electrónico'
                        className={styles.input}
                        maxLength={30}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label className={styles.label}
                        htmlFor='contraseña'
                    >Contraseña</label>
                    <input
                        id='contraseña'
                        type='password'
                        placeholder='Contraseña'
                        className={styles.input}
                        value={contraseña}
                        onChange={e => setPassword(e.target.value)}
                    />

                </div>

                <div>
                    <label className={styles.label}
                        htmlFor='passwordRep'
                    >Repetir Contraseña</label>
                    <input
                        id='passwordRep'
                        type='password'
                        placeholder='Repetir Contraseña'
                        className={styles.input}
                        value={repetirPassword}
                        onChange={e => setRepetirPassword(e.target.value)}
                    />
                </div>

                <div
                    className={styles.submit}
                >
                    <input
                        className={`${styles.button}`}
                        type="submit"
                        value={!loading ? "Crear Cuenta" : "Registrando..."}
                        disabled={loading}
                    />
                </div>
                {msg && <Alert alert={alert} />}
            </form>
            <div className={styles.nav}>
                <nav>
                    <p>
                        ¿Ya tienes tu cuenta?
                    </p>
                    <Link className={styles.link} to="/">
                        Iniciar sesión
                    </Link>
                </nav>
            </div>
        </div>
    );
};

export default SignUp;