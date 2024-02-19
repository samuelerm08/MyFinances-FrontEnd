import { useState } from "react";
import { getUserToken } from "../../services/token/tokenService";
import ModalUsuario from "../../components/pop-ups/ModalUsuario";
import useDark from "../../context/useDark";
import { BorrarUsuario } from "../../components/pop-ups/ModalBorrarUsuario";
import useAuth from "../../context/useAuth";

const Usuario = () => {
    const user = getUserToken();
    const { auth } = useAuth();
    const [deleteModal, setDeleteModal] = useState(false);
    const [animarModal, setAnimarModal] = useState(false);
    const [modalModificarPerfil, setModalPerfil] = useState(false);
    const [animarModalPerfil, setAnimarModalPerfil] = useState(false);
    const { dark } = useDark();

    const handleModificarPerfil = () => {
        setModalPerfil(true);
        setTimeout(() => {
            setAnimarModalPerfil(true);
        }, 400);
    };

    const handleDeletingModal = () => {
        setDeleteModal(true);
        setTimeout(() => {
            setAnimarModal(true);
        }, 400);
    };

    return (

        <div className={(dark === "light" ?
            "bg-gray-200 rounded-lg shadow-md hover:shadow-violet-400 w-1/3 flex justify-center items-center text-center m-auto p-5"
            : "bg-gray-600 rounded-lg shadow-md hover:shadow-violet-400 w-1/3 flex justify-center items-center text-center m-auto p-5"
        )}>
            <div className="w-full">
                <h1 className={(dark === "dark" ?
                    "text-violet-400 font-semibold"
                    :
                    "text-violet-600 font-semibold"
                )}>NOMBRE</h1>
                <p className={(dark === "dark" ?
                    "text-gray-200 font-semibold"
                    :
                    "text-gray-900 font-semibold"
                )}>{user.nombre}</p>
                <h1 className={(dark === "dark" ?
                    "text-violet-400 font-semibold"
                    :
                    "text-violet-600 font-semibold"
                )}>APELLIDO</h1>
                <p className={(dark === "dark" ?
                    "text-gray-200 font-semibold"
                    :
                    "text-gray-900 font-semibold"
                )}
                >{user.apellido}</p>
                <h1 className={(dark === "dark" ?
                    "text-violet-400 font-semibold"
                    :
                    "text-violet-600 font-semibold"
                )}>CORREO ELECTRÓNICO</h1>
                <p className={(dark === "dark" ?
                    "text-gray-200 font-semibold"
                    :
                    "text-gray-900 font-semibold"
                )}
                >{user.email}</p>
                <div className="flex justify-around items-center p-5">
                    <button
                        onClick={handleModificarPerfil}
                        className="text-white text-sm bg-violet-400 p-3 rounded-md uppercase font-bold p-absolute shadow-md hover:shadow-violet-500">
                        Modificar Perfil
                    </button>
                    {
                        modalModificarPerfil &&
                        <ModalUsuario
                            setModal={setModalPerfil}
                            animarModal={animarModalPerfil}
                            setAnimarModal={setAnimarModalPerfil}
                        />
                    }

                    <button
                        className="text-white text-sm bg-red-500 p-3 rounded-md uppercase font-semibold p-absolute shadow-md hover:shadow-red-600"
                        onClick={() => handleDeletingModal()}>
                        Eliminar cuenta
                    </button>
                    {
                        deleteModal && <BorrarUsuario
                            setAnimarModal={setAnimarModal}
                            setModal={setDeleteModal}
                            animarModal={animarModal}
                            auth={auth}
                            userId={user.id}
                        />
                    }
                </div>
            </div>
        </div>
    );
};
export default Usuario;