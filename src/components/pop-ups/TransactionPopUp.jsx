import { useState } from "react";
import useAuth from "../../context/UseAuth";
import { getUserToken } from "../../services/token/TokenService";
import { newTransaction } from "../../services/myfinances-api/Transaction";
import { amountReGex, errors, type } from "../../constants/MyFinancesConstants";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import en from "date-fns/locale/en-US";
import { getBalanceByUserId } from "../../services/myfinances-api/Balance";
import { HttpStatusCode } from "axios";
import Alert from "../Alert";

const TransactionPopUp = ({
    setPopUp,
    animate,
    setAnimate,
    setTransactions,
    setBalance,
    balance,
    categories,
    setMetadata,
    metadata
}) => {
    const [alert, setAlert] = useState({});
    const { auth } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState("");
    const [details, setDetails] = useState("");
    const [amount, setAmount] = useState("");
    const [transactionType, setTransactionType] = useState("Income");
    const [categoryId, setCategory] = useState(categories[0].id);
    const user = getUserToken();
    const isNavigationEnabled = !!setMetadata && metadata.totalCount <= 10;

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
                msg: "All fields are required!",
                error: true
            });
        }

        setTimeout(() => {
            setAlert({});
        }, 3000);

        let payload = {
            date: date,
            details: details,
            amount: parseFloat(amount),
            transactionType: transactionType,
            categoryId: parseInt(categoryId),
            balanceId: parseInt(balance?.id) ?? null,
            userId: parseInt(user.id),
            isActive: true
        };

        if (!balance?.id) {
            try {
                const { data, status } = await getBalanceByUserId(user.id, config);
                if (status === HttpStatusCode.Ok) payload = { ...payload, balanceId: data.id };
            } catch (error) {
                setError(error);
            }
        }

        try {
            const { data, status } = await newTransaction(payload, config);
            if (status === 201) {
                setLoading(false);
                setAlert({
                    msg: "Transaction Created!",
                    error: false
                });
                setTimeout(() => {
                    setAlert({});
                    setTransactions(transactions => [data, ...transactions]);
                    if (setBalance) {
                        const isExpense = data.transactionType === type.EXPENSE;
                        !balance?.totalBalance
                            ?
                            setBalance({
                                ...balance,
                                id: parseInt(data.balance_Id),
                                totalBalance: parseFloat(data.balance?.totalBalance)
                            })
                            :
                            setBalance({
                                ...balance,
                                id: parseInt(data.balanceId),
                                totalBalance:
                                    !isExpense ?
                                        balance.totalBalance + parseFloat(amount) :
                                        balance.totalBalance - parseFloat(amount) 
                            });
                    }

                    if (isNavigationEnabled) setMetadata({ ...metadata, totalCount: metadata.totalCount + 1 });
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
                            locale={en}
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
                            maxLength={80}
                            placeholder="Details"
                            value={details}
                            onChange={e => setDetails(e.target.value)}
                        />
                    </div>
                    <div className='field'>
                        <label htmlFor="amount">Amount</label>
                        <input
                            id="amount"
                            type="text"
                            placeholder="Enter amount"
                            value={amount.replace(",", ".")}
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
                            onChange={e => setTransactionType(e.target.value)}
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
                        value={!loading ? "Create" : "Loading..."}
                        disabled={loading}
                    />

                    {msg && <Alert alert={alert} />}

                </form>
            </div>
        </div>
    );
};

export default TransactionPopUp;