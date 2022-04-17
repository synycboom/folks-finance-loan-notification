import Button from "antd/lib/button";
import Modal from "antd/lib/modal";
import Popover from "antd/lib/popover";
import { useState } from "react";
import styled from "styled-components";
import CaretDownOutlined from "@ant-design/icons/lib/icons/CaretDownOutlined";
import MyAlgoWallet from "@randlabs/myalgo-connect";
import { useAccount } from "../helpers/account";
import { formatAddress } from "../helpers";
import AccountMenu from "./AccountMenu";

const myAlgoWallet = new MyAlgoWallet();

const Style = styled.div`
  .ant-btn {
    font-weight: bold;
  }
`;

const ModalStyle = styled(Modal)`
  .ant-btn:not(:last-child) {
    margin-bottom: 8px;
  }

  .ant-btn {
    font-weight: bold;

    .provider-button {
      display: flex;
    }
  }

  .provider-logo {
    width: 24px;
    margin-right: 8px;
  }
`;

const ConnectWalletButton = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [currectAddresses, setCurrectAddresses] = useState<string[]>([]);
  const { account, connect } = useAccount();
  const { selectedAddress, isConnect } = account;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const hidePopover = () => {
    setIsPopoverVisible(false);
  };

  const selectAddress = (addresses: string[], address: string) => {
    connect(addresses, address);
    hideModal();
  };

  const algoConnect = () => {
    myAlgoWallet
      .connect()
      .then((accounts) => {
        const addresses = accounts.map((account) => account.address);
        setCurrectAddresses(addresses);
        if (addresses.length < 2) {
          selectAddress(addresses, addresses[0]);
        }
      })
      .catch((err: any) => {
        // Error
      });
  };

  return (
    <Style>
      {isConnect ? (
        <Popover
          content={<AccountMenu />}
          trigger="click"
          placement="bottomRight"
          visible={isPopoverVisible}
          overlayInnerStyle={{ borderRadius: 8 }}
          onVisibleChange={(visible) => setIsPopoverVisible(visible)}
        >
          <Button size="large" shape="round">
            {formatAddress(selectedAddress)}
            <CaretDownOutlined />
          </Button>
        </Popover>
      ) : (
        <Button
          size="large"
          onClick={showModal}
          shape="round"
          style={{ width: 300, height: 50 }}
        >
          Connect Wallet
        </Button>
      )}
      {/* @ts-ignore */}
      <ModalStyle
        title="Connect Wallet"
        visible={isModalVisible}
        footer={null}
        maskClosable
        width={320}
        onCancel={hideModal}
      >
        {currectAddresses.length > 1 ? (
          currectAddresses.map((address) => (
            <Button
              type="primary"
              shape="round"
              key={address}
              block
              size="large"
              onClick={() => selectAddress(currectAddresses, address)}
            >
              {formatAddress(address)}
            </Button>
          ))
        ) : (
          <Button
            type="primary"
            shape="round"
            className="provider-button"
            block
            size="large"
            onClick={algoConnect}
          >
            <img src="/my-algo.png" alt="my-algo" className="provider-logo" />
            My Algo
          </Button>
        )}
        {/* <Button type="primary" shape="round" block size="large">
          <img
            src="/pera-wallet-white.svg"
            alt="pera-wallet"
            className="provider-logo"
          />{" "}
          Pera Algo Wallet
        </Button> */}
      </ModalStyle>
    </Style>
  );
};

export default ConnectWalletButton;
