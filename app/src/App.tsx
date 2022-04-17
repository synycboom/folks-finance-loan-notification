import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MyBorrowPage from "./pages/MyBorrowPage";
import SettingPage from "./pages/SettingPage";
import { useAccount } from "./helpers/account";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const { account } = useAccount();

  useEffect(() => {
    if (!account.isConnect) {
      navigate("/");
    }
  }, [navigate, account]);

  return (
    <Routes>
      <Route path="/my-borrows" element={<MyBorrowPage />} />
      <Route path="/setting" element={<SettingPage />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;
