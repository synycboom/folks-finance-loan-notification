import Card from "antd/lib/card";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Switch from "antd/lib/switch";
import Divider from "antd/lib/divider";
import Title from "antd/lib/typography/Title";
import styled from "styled-components";
import { TOKEN } from "../constants/token";
import DecimalSlider from "./DecimalSlider";

const BorrowCardStyle = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;

  img {
    width: 24px;
  }

  .ant-switch {
    margin-right: 8px;
  }
`;

const BorrowCard = () => {
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
            <img src={TOKEN["USDC"].logoUrl} alt="logo" /> 123 USDC
          </Title>
          <Title level={5}>
            <img src={TOKEN["ALGO"].logoUrl} alt="logo" /> 321 ALGO
          </Title>
          <Title level={5}>1.2</Title>
        </Col>
        <Col span={1}>
          <Divider type="vertical" style={{ height: "100%" }} />
        </Col>
        <Col span={13}>
          <Title level={5}>Notify when health factor is below</Title>
          <DecimalSlider />
          <Title level={5} style={{ marginTop: 8 }}>
            <Switch /> Notify on Discord
          </Title>
          <Title level={5}>
            <Switch /> Notify on Telegram
          </Title>
        </Col>
      </Row>
    </BorrowCardStyle>
  );
};

export default BorrowCard;