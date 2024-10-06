import { useState } from "react";
import Alert from "../Alert";
import useAuth from "../../context/UseAuth";
import { getUserToken, setUserToken } from "../../services/token/TokenService";
import { modifyProfile } from "../../services/myfinances-api/user";
import { textsReGex } from "../../constants/MyFinancesConstants";

const UserPopUp = ({ setPopUp, animate, setAnimate }) => {
    const [alert, setAlert] = useState({});
    const user = getUserToken();
    const { auth } = useAuth();
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);

    const hidePopUp = () => {
        setAnimate(false);
        setTimeout(() => {
            setPopUp(false);
        }, 200);
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const payload = {
            id: parseInt(user.id),
            firstName: firstName,
            lastName: lastName
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
            setAlert({
                msg: "User modified!",
                error: false
            });
            setTimeout(() => {
                setAlert({});
                hidePopUp();
            }, 1500);
        } catch (error) {
            setAlert(error);
        }
    };

    const { msg } = alert;
    return (
        <div className="popUp">

            <div className='modalContainer'>
                <form

                    onSubmit={handleSubmit}
                    className={`form ${animate ? "animate" : "close"}`}
                >
                    <div className="close-popUp">
                        <i className="fa-regular fa-circle-xmark"
                            onClick={hidePopUp}></i>
                    </div>

                    <div className='field'>
                        <label htmlFor="firstName">First Name</label>
                        <input
                            id="firstName"
                            type="text"
                            placeholder="First Name"
                            maxLength={30}
                            value={firstName}
                            onChange={e => {
                                if (textsReGex.test(e.target.value) || e.target.value === "") {
                                    setFirstName(e.target.value);
                                }
                            }}
                        />

                    </div>

                    <div className='field'>
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            id="lastName"
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            maxLength={30}
                            onChange={e => {
                                if (textsReGex.test(e.target.value) || e.target.value === "") {
                                    setLastName(e.target.value);
                                }
                            }}
                        />

                    </div>

                    <div className='field'>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="text"
                            defaultValue={user.email}
                            disabled={true}
                        />

                    </div>

                    <input
                        type="submit"
                        value="Submit"/>
                    {msg && <Alert alert={alert} />}
                </form>
            </div>
        </div>
    );
};

export default UserPopUp;