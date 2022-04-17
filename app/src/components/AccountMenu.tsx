import styled from "styled-components";
import Typography from "antd/lib/typography";
import Button from "antd/lib/button";
import Select from "antd/lib/select";
import { formatAddress } from "../helpers";
import { useAccount } from "../helpers/account";

const { Option } = Select;
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
    margin: 16px 0px;
  }
`;

const AccountMenu = () => {
  const { account, disconnect, changeAddress } = useAccount();
  const handleAddressChange = (address: string) => {
    changeAddress(address);
  };
  const { addresses, selectedAddress } = account;

  return (
    <AccountMenuStyle>
      <Title level={5}>Accounts</Title>
      <Select
        defaultValue={selectedAddress}
        size="large"
        dropdownStyle={{ borderRadius: 8 }}
        onChange={handleAddressChange}
      >
        {addresses.map((address) => (
          <Option
            key={address}
            value={address}
            style={{
              height: 42,
              display: "flex",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {formatAddress(address)}
          </Option>
        ))}
      </Select>
      <Title
        level={5}
        copyable={{ text: selectedAddress }}
        className="copy-address"
      >
        Copy Address: <br />
        {formatAddress(selectedAddress)}
      </Title>
      <Button shape="round" block size="large" onClick={disconnect}>
        Disconnect
      </Button>
    </AccountMenuStyle>
  );
};

export default AccountMenu;
