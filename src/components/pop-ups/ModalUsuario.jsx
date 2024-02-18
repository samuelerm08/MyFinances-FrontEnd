import { useState } from "react";
import Alerta from "../Alerta";
import useAuth from "../../context/useAuth";
import { getUserToken, setUserToken } from "../../services/token/tokenService";
import { modifyProfile } from "../../services/myfinances-api/usuario";
import { textsReGex } from "../../constants/myfinances-constants";


const ModalUsuario = ({ setModal, animarModal, setAnimarModal }) => {
    const [alerta, setAlerta] = useState({});
    const user = getUserToken();
    const { auth } = useAuth();
    const [nombre, setNombre] = useState(user.nombre);
    const [apellido, setApellido] = useState(user.apellido);

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
            Nombre: nombre,
            Apellido: apellido
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
                nombre: data.nombre,
                apellido: data.apellido
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

    const { msg } = alerta;

    return (
        <div className="modal">

            <div className='modalContainer'>
                <form

                    onSubmit={handleSubmit}
                    className={`formulario ${animarModal ? "animar" : "cerrar"}`}
                >
                    <div className="cerrar-modal">
                        <i className="fa-regular fa-circle-xmark"
                            onClick={ocultarModal}></i>
                    </div>

                    <div className='campo'>
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            id="nombre"
                            type="text"
                            placeholder="Nombre"
                            maxLength={30}
                            value={nombre}
                            onChange={e => {
                                if (textsReGex.test(e.target.value) || e.target.value === "") {
                                    setNombre(e.target.value);
                                }
                            }}
                        />

                    </div>

                    <div className='campo'>
                        <label htmlFor="apellido">Apellido</label>
                        <input
                            id="apellido"
                            type="text"
                            placeholder="Apellido"
                            value={apellido}
                            maxLength={30}
                            onChange={e => {
                                if (textsReGex.test(e.target.value) || e.target.value === "") {
                                    setApellido(e.target.value);
                                }
                            }}
                        />

                    </div>

                    <div className='campo'>
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
                    {msg && <Alerta alerta={alerta} />}
                </form>
            </div>
        </div>
    );
};

export default ModalUsuario;