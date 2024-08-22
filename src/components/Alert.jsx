
const Alert = ({ alert }) => {
    return (
        <div className={`${alert.error ? "from-red-400 to-red-500" : "from-green-200 to-green-500"}
                        ${alert.warn ? "from-orange-400 to-orange-500" : "from-green-200 to-green-500"}
      bg-gradient-to-br text-center p-2 rounded-xl text-white font-bold text-sm m-2`}>
            {alert.msg}
        </div>
    );
};

export default Alert;