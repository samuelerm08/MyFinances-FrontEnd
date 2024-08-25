import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login/Login";
import ProtectedPath from "./layouts/ProtectedPath";
import Dashboard from "./pages/Dashboard/Dashboard";
import { AuthProvider } from "./context/AuthProvider";
import { DarkProvider } from "./context/DarkProvider";
import Balance from "./pages/Balance/Balance";
import SignUp from "./pages/SignUp/SignUp";
import Goals from "./pages/Goals/Goals";
import Usuario from "./pages/User/User";
import Transactions from "./pages/Transactions/Transactions";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <DarkProvider>
                    <Routes>
                        <Route path="/" element={<AuthLayout />}>
                            <Route index element={<Login />} />
                            <Route path="signup" element={<SignUp />} />
                        </Route>
                        <Route path="/dashboard" element={<ProtectedPath />}>
                            <Route path="index" element={<Dashboard />} />
                            <Route path="goals" element={<Goals />} />
                            <Route path="transactions" element={< Transactions />} />
                            <Route path="balance" element={<Balance />} />
                            <Route path="user" element={<Usuario />} />
                        </Route>
                    </Routes>
                </DarkProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
export default App;