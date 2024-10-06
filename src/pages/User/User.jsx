import { useState } from "react";
import { getUserToken } from "../../services/token/TokenService";
import useDark from "../../context/UseDark";
import { DeleteUserData } from "../../components/pop-ups/DeleteUserData";
import useAuth from "../../context/UseAuth";
import UserPopUp from "../../components/pop-ups/UserPopUp";

const User = () => {
    const user = getUserToken();
    const { auth } = useAuth();
    const [deletePopUp, setDeletePopUp] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [modifyPopUp, setModifyPopUp] = useState(false);
    const [animateProfilePopUp, setAnimateProfilePopUp] = useState(false);
    const { dark } = useDark();

    const modifyProfile = () => {
        setModifyPopUp(true);
        setTimeout(() => {
            setAnimateProfilePopUp(true);
        }, 400);
    };

    const handleDelete = () => {
        setDeletePopUp(true);
        setTimeout(() => {
            setAnimate(true);
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
                )}>First Name</h1>
                <p className={(dark === "dark" ?
                    "text-gray-200 font-semibold"
                    :
                    "text-gray-900 font-semibold"
                )}>{user.firstName}</p>
                <h1 className={(dark === "dark" ?
                    "text-violet-400 font-semibold"
                    :
                    "text-violet-600 font-semibold"
                )}>Last Name</h1>
                <p className={(dark === "dark" ?
                    "text-gray-200 font-semibold"
                    :
                    "text-gray-900 font-semibold"
                )}
                >{user.lastName}</p>
                <h1 className={(dark === "dark" ?
                    "text-violet-400 font-semibold"
                    :
                    "text-violet-600 font-semibold"
                )}>Email</h1>
                <p className={(dark === "dark" ?
                    "text-gray-200 font-semibold"
                    :
                    "text-gray-900 font-semibold"
                )}
                >{user.email}</p>
                <div className="flex justify-around items-center p-5">
                    <button
                        onClick={modifyProfile}
                        className="text-white text-sm bg-violet-400 p-3 rounded-md uppercase font-bold p-absolute shadow-md hover:shadow-violet-500">
                        Modify Profile
                    </button>
                    {
                        modifyPopUp &&
                        <UserPopUp
                            setPopUp={setModifyPopUp}
                            setAnimate={setAnimate}
                            animate={animateProfilePopUp}
                        />
                    }

                    <button
                        className="text-white text-sm bg-red-500 p-3 rounded-md uppercase font-semibold p-absolute shadow-md hover:shadow-red-600"
                        onClick={handleDelete}>
                        Delete account
                    </button>
                    {
                        deletePopUp && <DeleteUserData
                            setAnimate={setAnimate}
                            setPopUp={setDeletePopUp}
                            animate={animate}
                            auth={auth}
                            userId={user.id}
                        />
                    }
                </div>
            </div>
        </div>
    );
};
export default User;