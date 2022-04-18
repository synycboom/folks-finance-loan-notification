import styled from "styled-components";
import Typography from "antd/lib/typography";
import Button from "antd/lib/button";
import { formatAddress } from "../helpers";
import { useAccount } from "../helpers/account";

const { Title } = Typography;

const AccountMenuStyle = styled.div`
  padding: 8px;
  width: 280px;
  border-radius: 16px;

  .ant-select {
    border-radius: 8px;
    width: 100%;
    text-align: center;

    .ant-select-selector {
      border-radius: 8px;
    }
  }

  .copy-address {
    margin-bottom: 16px;
  }
`;

const AccountMenu = () => {
  const { account, disconnect } = useAccount();

  const { address } = account;

  return (
    <AccountMenuStyle>
      <Title level={5} copyable={{ text: address }} className="copy-address">
        Copy Address: <br />
        {formatAddress(address)}
      </Title>
      <Button shape="round" block size="large" onClick={disconnect}>
        Disconnect
      </Button>
    </AccountMenuStyle>
  );
};

export default AccountMenu;
