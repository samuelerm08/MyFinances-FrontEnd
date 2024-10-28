import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login/Login";
import ProtectedPath from "./layouts/ProtectedPath";
import Dashboard from "./pages/Dashboard/Dashboard";
import { AuthProvider } from "./context/AuthProvider";
import { DarkProvider } from "./context/DarkProvider";
import Goals from "./pages/Goals/Goals";
import Transactions from "./pages/Transactions/Transactions";
import SignUp from "./pages/SignUP/SignUp";
import User from "./pages/User/User";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <DarkProvider>
                    <Routes>
                        <Route path="/" element={<AuthLayout />}>
                            <Route index element={<Login />} />
                            <Route path="SignUp" element={<SignUp />} />
                        </Route>
                        <Route path="/dashboard" element={<ProtectedPath />}>
                            <Route path="index" element={<Dashboard />} />
                            <Route path="goals" element={<Goals />} />
                            <Route path="transactions" element={< Transactions />} />
                            <Route path="user" element={<User />} />
                        </Route>
                    </Routes>
                </DarkProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
export default App;