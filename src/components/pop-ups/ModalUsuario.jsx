import { useState } from "react";
import Alert from "../Alert";
import useAuth from "../../context/useAuth";
import { getUserToken, setUserToken } from "../../services/token/tokenService";
import { modifyProfile } from "../../services/myfinances-api/user";
import { textsReGex } from "../../constants/myfinances-constants";


const ModalUsuario = ({ setModal, animarModal, setAnimarModal }) => {
    const [alert, setAlerta] = useState({});
    const user = getUserToken();
    const { auth } = useAuth();
    const [firstName, setNombre] = useState(user.firstName);
    const [lastName, setApellido] = useState(user.lastName);

    const ocultarModal = () => {
        setAnimarModal(false);
        setTimeout(() => {
            setModal(false);
        }, 200);
    };

    const handleSubmit = async e => {
        e.preventDefault();


        const payload = {
            Id: parseInt(user.id),
            Nombre: firstName,
            Apellido: lastName
        };

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth}`
            }

        };

        try {
            const { data } = await modifyProfile(user.id, payload, config);
            setUserToken("user",JSON.stringify({
                ...user,
                firstName: data.firstName,
                lastName: data.lastName
            }));
            setAlerta({
                msg: "Usuario Modificado!",
                error: false
            });
            setTimeout(() => {
                setAlerta({});
                ocultarModal();
            }, 1500);
        } catch (error) {
            setAlerta(error);
        }
    };

    const { msg } = alert;

    return (
        <div className="popUp">

            <div className='modalContainer'>
                <form

                    onSubmit={handleSubmit}
                    className={`form ${animarModal ? "animate" : "close"}`}
                >
                    <div className="close-popUp">
                        <i className="fa-regular fa-circle-xmark"
                            onClick={ocultarModal}></i>
                    </div>

                    <div className='field'>
                        <label htmlFor="firstName">Nombre</label>
                        <input
                            id="firstName"
                            type="text"
                            placeholder="Nombre"
                            maxLength={30}
                            value={firstName}
                            onChange={e => {
                                if (textsReGex.test(e.target.value) || e.target.value === "") {
                                    setNombre(e.target.value);
                                }
                            }}
                        />

                    </div>

                    <div className='field'>
                        <label htmlFor="lastName">Apellido</label>
                        <input
                            id="lastName"
                            type="text"
                            placeholder="Apellido"
                            value={lastName}
                            maxLength={30}
                            onChange={e => {
                                if (textsReGex.test(e.target.value) || e.target.value === "") {
                                    setApellido(e.target.value);
                                }
                            }}
                        />

                    </div>

                    <div className='field'>
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                            id="email"
                            type="text"
                            defaultValue={user.email}
                            disabled={true}
                        />

                    </div>


                    <input
                        type="submit"
                        value="Aceptar"/>
                    {msg && <Alert alert={alert} />}
                </form>
            </div>
        </div>
    );
};

export default ModalUsuario;