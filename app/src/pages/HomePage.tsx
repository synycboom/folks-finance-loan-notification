import styled from "styled-components";
import ConnectWalletButton from "../components/ConnectWalletButton";

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
  return (
    <HomePageStyle>
      <img src="/logo.svg" alt="logo" />
      <ConnectWalletButton />
    </HomePageStyle>
  );
};

export default HomePage;
