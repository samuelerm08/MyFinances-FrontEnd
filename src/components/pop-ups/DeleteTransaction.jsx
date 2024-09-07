import { useState } from "react";
import { texts } from "../../constants/myfinances-constants";
import Alert from "../Alert";
import { deleteTransaction } from "../../services/myfinances-api/transaction";
import { HttpStatusCode } from "axios";

export const DeleteTransaction = ({ animate, setAnimate, setPopUp, transactionId, auth, transactions, setTransactions }) => {
    const [alert, setAlert] = useState({});
    const [loading, setLoading] = useState(false);

    const hidePopUp = () => {
        setAnimate(false);
        setTimeout(() => {
            setPopUp(false);
        }, 200);
    };

    const handleDelete = async (transactionId) => {
        setLoading(true);
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth}`
            }
        };

        try {
            const { data, status } = await deleteTransaction(transactionId, config);
            if (status === HttpStatusCode.Ok) {
                setLoading(false);
                setAlert({
                    msg: texts.ON_DELETING_SUCCESS,
                    error: false
                });
                setTimeout(() => {
                    setAlert({});
                    setTransactions(transactions.map((transaction) =>
                        transaction.id === transactionId ?
                            { ...transaction, isActive: data.isActive } : transaction
                    ));
                    hidePopUp();
                }, 2000);
            }
        } catch (error) {
            
        }
    };

    const { msg } = alert;

    return (
        <div className="modalDelete">
            <div className="modalDeleteContainer shadow-md p-5">
                <div
                    className={`deletePopUp ${animate ? "animate" : "close"}`}
                >
                    <div className="closeDeletePopUp">
                        <i className="fa-regular fa-circle-xmark"
                            onClick={hidePopUp}></i>
                    </div>

                    <div className='textDelete text-center pb-10 pr-10 pl-10 pt-10 flex flex-col items-center'>
                        <div>
                            <h3 className="text-gray-800 text-lg">
                                {texts.ON_DELETING_QUESTION}
                            </h3>
                            <div className="text-center rounded-xl p-3 bg-orange-400 shadow-md hover:shadow-orange-400">
                                <h3 className="text-lg text-gray-800 text-center">
                                    {texts.ON_DELETING_WARN}
                                </h3>
                            </div>
                        </div>
                    </div>
                    {msg && <Alert alert={alert} />}
                    <div className="deletePopUpButtons flex flex-row justify-around">
                        <input
                            type="submit"
                            value={"Back"}
                            onClick={hidePopUp}
                            className="backDeleteButton"
                        />

                        <input
                            type="submit"
                            value={!loading ? "Delete" : "Deleting..."}
                            disabled={loading}
                            onClick={() => handleDelete(transactionId)}
                            className="deleteButton"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};