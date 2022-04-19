import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MyBorrowPage from "./pages/MyBorrowPage";
import SettingPage from "./pages/SettingPage";
import { useAccount } from "./helpers/account";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuth } = useAccount();

  useEffect(() => {
    checkAuth().then((account) => {
      if (account.isConnect && location.pathname === "/") {
        navigate("/my-borrows");
      } else if (!account.isConnect && location.pathname !== "/") {
        navigate("/");
      }
    });
  }, []);

  return (
    <Routes>
      <Route path="/my-borrows" element={<MyBorrowPage />} />
      <Route path="/setting" element={<SettingPage />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;
