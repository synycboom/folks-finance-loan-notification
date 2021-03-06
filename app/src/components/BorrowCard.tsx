import Card from "antd/lib/card";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import message from "antd/lib/message";
import Switch from "antd/lib/switch";
import Divider from "antd/lib/divider";
import Button from "antd/lib/button";
import Title from "antd/lib/typography/Title";
import styled from "styled-components";
import { TOKEN } from "../constants/token";
import DecimalSlider from "./DecimalSlider";
import { Loan, Setting } from "../types";
import { useState } from "react";
import { createOrUpdateNotification } from "../helpers/api";
import { useUser } from "../helpers/user";
import { useNavigate } from "react-router-dom";

const BorrowCardStyle = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;

  img {
    width: 24px;
    margin-right: 8px;
  }

  .ant-switch {
    margin-right: 8px;
  }
`;

const DEFAULT_VALUE = {
  notifyDiscord: false,
  notifyTelegram: false,
  targetHealthFactor: 1,
};

const BorrowCard = ({ loan, setting }: { loan: Loan; setting?: Setting }) => {
  const [data, setData] = useState(setting || DEFAULT_VALUE);
  const { user } = useUser();
  const navigate = useNavigate();

  const {
    borrowBalance,
    collateralBalance,
    healthFactor,
    borrowToken,
    collateralToken,
    tokenPair,
    escrowAddress,
    userAddress,
  } = loan;

  const { discordUserName, telegramUsername } = user;

  const getHealthFactorColor = (value: number) => {
    return undefined;
    // if (value > 1.05) {
    //   return "success";
    // } else if (value <= 1.05) {
    //   return "warning";
    // } else {
    //   return "danger";
    // }
  };

  const setDataField = (field: any, value: any) => {
    setData({
      ...data,
      [field]: value,
    });
  };

  const onSave = async () => {
    await createOrUpdateNotification({
      ...data,
      tokenPair,
      escrowAddress,
      currentHealthFactor: healthFactor,
      userAddress,
    });
    message.success("Updated successfully");
  };

  const { notifyDiscord, notifyTelegram, targetHealthFactor } = data;

  return (
    <BorrowCardStyle>
      <Row>
        <Col span={3}>
          <Title level={5}>Asset: </Title>
          <Title level={5}>Collateral: </Title>
          <Title level={5}>Health Factor: </Title>
        </Col>
        <Col span={5}>
          <Title level={5}>
            <img src={TOKEN[borrowToken].logoUrl} alt="logo" /> {borrowBalance}{" "}
            {borrowToken}
          </Title>
          <Title level={5}>
            <img src={TOKEN[collateralToken].logoUrl} alt="logo" />{" "}
            {collateralBalance} {collateralToken}
          </Title>
          <Title level={5} type={getHealthFactorColor(healthFactor)}>
            {healthFactor.toFixed(2)}
          </Title>
        </Col>
        <Col span={1}>
          <Divider type="vertical" style={{ height: "100%" }} />
        </Col>
        <Col span={13}>
          <Title level={5}>Notify when health factor is below</Title>
          <DecimalSlider
            value={targetHealthFactor}
            onChange={(value) => setDataField("targetHealthFactor", value)}
          />
          {discordUserName ? (
            <Title level={5} style={{ marginTop: 8 }}>
              <Switch
                checked={notifyDiscord}
                onChange={(value) => setDataField("notifyDiscord", value)}
              />{" "}
              Notify on Discord
            </Title>
          ) : (
            <Title level={5} style={{ marginTop: 8 }} disabled>
              <Switch disabled /> Notify on Discord{" "}
              <Button
                type="link"
                size="large"
                onClick={() => navigate("/settings")}
              >
                Connect to Discord
              </Button>
            </Title>
          )}
          {telegramUsername ? (
            <Title level={5}>
              <Switch
                checked={notifyTelegram}
                onChange={(value) => setDataField("notifyTelegram", value)}
              />{" "}
              Notify on Telegram
            </Title>
          ) : (
            <Title level={5} style={{ marginTop: 8 }} disabled>
              <Switch disabled /> Notify on Telegram{" "}
              <Button
                type="link"
                size="large"
                onClick={() => navigate("/settings")}
              >
                Connect to Telegram
              </Button>
            </Title>
          )}

          <Button
            style={{ width: 96, marginTop: 8 }}
            type="primary"
            size="large"
            shape="round"
            onClick={onSave}
          >
            Save
          </Button>
        </Col>
      </Row>
    </BorrowCardStyle>
  );
};

export default BorrowCard;
