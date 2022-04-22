import Button from "antd/lib/button";
import Modal from "antd/lib/modal";
import Popover from "antd/lib/popover";
import { useState } from "react";
import styled from "styled-components";
import CaretDownOutlined from "@ant-design/icons/lib/icons/CaretDownOutlined";
import { useAccount } from "../helpers/account";
import { formatAddress, myAlgoConnect, signMessage } from "../helpers";
import AccountMenu from "./AccountMenu";
import { getChallengeCode, login } from "../helpers/api";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";

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

  const { account, connect } = useAccount();
  const { address, isConnect } = account;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const algoConnect = async () => {
    const [account] = await myAlgoConnect.connect({
      shouldSelectOneAccount: true,
    });
    const address = account.address;
    const challenge = await getChallengeCode(address);
    const tx = await signMessage(address, challenge);
    await login(address, tx);
    hideModal();
    connect(address);
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
            {formatAddress(address)}
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
        <Title level={5}>Please read carefully</Title>
        <Paragraph>
          As Algorand does not support personal sign, you have to sign a
          transfer transaction to transfer 0 ALGO from yourself to yourself to
          prove that you own this address. <br />
          <br />
          <b>*THIS WILL NOT COST ANY GAS FEE* </b>
          because we will not submit it to the blockchain.
        </Paragraph>
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
