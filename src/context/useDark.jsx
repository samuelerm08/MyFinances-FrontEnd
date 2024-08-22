import { useContext } from "react";
import DarkContext from "./DarkProvider";
const useDark = () => {
    return useContext(DarkContext);
};

export default useDark;
