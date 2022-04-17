import styled from "styled-components";
import { Layout, Menu } from "antd";
import { useLocation, Link } from "react-router-dom";
import ConnectWalletButton from "./ConnectWalletButton";

const { Header, Content } = Layout;

const LayoutStyle = styled(Layout)`
  .ant-layout-header {
    background-color: white;
    display: flex;
  }

  .ant-layout-content {
    background-color: white;
  }

  .ant-menu {
    min-width: 200px;
    width: 100%;
  }

  .ant-menu-horizontal {
    border-bottom: none;
  }

  .logo-container {
    margin-right: 30px;
    img {
      width: 150px;
    }
  }

  .right-container {
    margin-left: auto;
  }
`;

const MainLayout = ({ children }: any) => {
  const location = useLocation();

  return (
    <LayoutStyle>
      <Header>
        <div className="logo-container">
          <img src="/logo.svg" alt="logo" />
        </div>
        <Menu mode="horizontal" selectedKeys={[location.pathname]}>
          <Menu.Item key="/my-borrows">
            <Link to="/my-borrows">My Borrows</Link>
          </Menu.Item>
          <Menu.Item key="/setting">
            <Link to="/setting">Setting</Link>
          </Menu.Item>
        </Menu>
        <div className="right-container">
          <ConnectWalletButton />
        </div>
      </Header>
      <Content>{children}</Content>
      {/* <Footer style={{ textAlign: "center" }}>
        Ant Design ©2018 Created by Ant UED
      </Footer> */}
    </LayoutStyle>
  );
};

export default MainLayout;
