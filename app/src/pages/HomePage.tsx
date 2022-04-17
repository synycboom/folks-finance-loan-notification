import styled from "styled-components";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConnectWalletButton from "../components/ConnectWalletButton";
import { useAccount } from "../helpers/account";

const HomePageStyle = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    max-width: 500px;
    width: 100%;
    padding: 24px;
  }
`;

const HomePage = () => {
  const navigate = useNavigate();
  const { account } = useAccount();

  useEffect(() => {
    if (account.isConnect) {
      navigate("/my-borrows");
    }
  }, [navigate, account]);

  return (
    <HomePageStyle>
      <img src="/logo.svg" alt="logo" />
      <ConnectWalletButton />
    </HomePageStyle>
  );
};

export default HomePage;
