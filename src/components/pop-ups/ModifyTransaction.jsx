import { useState } from "react";
import { modifyTransaction } from "../../services/myfinances-api/Transaction";
import { amountReGex, errors, textsReGex } from "../../constants/MyFinancesConstants";
import Alert from "../Alert";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import { getUserToken } from "../../services/token/TokenService";
import useAuth from "../../context/UseAuth";
import { HttpStatusCode } from "axios";

export const ModifyTransaction = ({
    animate,
    setAnimate,
    setPopUp,
    transactionId,
    transaction,
    setTransaction,
    setTransactions,
    balance,
    categories
}) => {
    const { auth } = useAuth();
    const [alert, setAlert] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date(transaction.date).toISOString().substring(0,10));
    const [details, setDetails] = useState(transaction.details);
    const [amount, setAmount] = useState(transaction.amount);
    const [transactionType, setType] = useState(transaction.transactionType);
    const [categoryId, setCategory] = useState(transaction?.category?.id ?? transaction?.categoryId);
    const user = getUserToken();
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`
        }
    };

    const hidePopUp = () => {
        setAnimate(false);
        setTimeout(() => {
            setPopUp(false);
        }, 200);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        if ([details, amount].length === 0) {
            setAlert({
                msg: "All fields are required",
                error: true
            });
        }

        setTimeout(() => {
            setAlert({});
        }, 3000);

        const payload = {
            id: transactionId,
            date: date,
            details: details,
            amount: parseFloat(amount),
            transactionType: transactionType,
            categoryId: parseInt(categoryId),
            balanceId: parseInt(balance?.id) ?? null,
            userId: parseInt(user.id),
            isActive: true
        };

        try {
            const { data, status } = await modifyTransaction(transactionId, payload, config);
            if (status === HttpStatusCode.Ok) {
                setLoading(false);
                setAlert({
                    msg: "Modified!",
                    error: false
                });
                    setTimeout(() => {
                    setAlert({});
                    setTransaction(data);
                    setTransactions(transactions => transactions.map((transaction) =>
                        transaction.id === transactionId ? data : transaction
                    ));
                    hidePopUp();
                }, 1500);
            }
        } catch (error) {
            if (!error.errors) {
                if (error.message === errors.badRequests.BAD_REQUEST) {
                    setAlert({
                        msg: errors.badRequests.REQUIRED_FIELDS,
                        error: true
                    });
                    setTimeout(() => {
                        setLoading(false);
                        setAlert({});
                    }, 3000);
                }
            }
            else {
                if (error.status === errors.badRequests.BAD_REQUEST_CODE) {
                    setAlert({
                        msg: errors.badRequests.REQUIRED_FIELDS,
                        error: true
                    });
                    setTimeout(() => {
                        setLoading(false);
                        setAlert({});
                    }, 3000);
                }
            }
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
                        <label htmlFor="Date">Date</label>
                        <ReactDatePicker
                            locale={es}
                            className="bg-[#E5E7EB] rounded-md p-1"
                            value={date}
                            placeholderText="Date"
                            onChange={(date) => setDate(date.toISOString().split("T")[0])}
                        />
                    </div>

                    <div className='field'>
                        <label htmlFor="details">Details</label>
                        <input
                            id="details"
                            type="text"
                            placeholder="Details"
                            maxLength={80}
                            value={details}
                            onChange={e => {
                                if (textsReGex.test(e.target.value) || e.target.value === "") {
                                    setDetails(e.target.value);
                                }
                            }}
                        />
                    </div>
                    <div className='field'>
                        <label htmlFor="amount">Amount</label>
                        <input
                            id="amount"
                            type="text"
                            placeholder="Enter amount"
                            value={amount.toString().replace(",", ".")}
                            onChange={e => {
                                if (e.target.value === "" || amountReGex.test(e.target.value.replace(",", "."))) {
                                    setAmount(e.target.value);
                                }
                            }}
                        />
                    </div>

                    <div className='field'>
                        <label htmlFor="transactionType">Type</label>
                        <select name="transactionType" id="transactionType" value={transactionType}
                            onChange={e => setType(e.target.value)}
                        >
                            <option defaultValue={"Income"} value="Income">Income</option>
                            <option value="Expense">Expense</option>
                        </select>
                    </div>

                    <div className='field'>
                        <label htmlFor="category">Category</label>
                        <select name="category" id="category" value={categoryId}
                            onChange={e => setCategory(e.target.value)}
                        >
                            {
                                categories?.map((c, index) => {
                                    return (
                                        <option
                                            defaultValue={c.id}
                                            value={c.id}
                                            key={index}>
                                            {c.title}
                                        </option>
                                    );
                                })
                            }
                        </select>
                    </div>

                    <input
                        type="submit"
                        value={!loading ? "Submit" : "Loading..."}
                        disabled={loading}
                    />

                    {msg && <Alert alert={alert} />}

                </form>
            </div>
        </div>
    );
};