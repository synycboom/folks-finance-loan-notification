import styled from "styled-components";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import Button from "antd/lib/button";
import Card from 'antd/lib/card';
import MainLayout from "../components/MainLayout";

const { Meta } = Card;

const SettingPageStyle = styled.div`
  .social-container {
    margin-bottom: 8px;
  }

  .social-icon {
    width: 40px;
    margin-right: 8px;
  }

  .connect-title {
    display: flex;
    align-items: center;
  }

  .connect-description {
    margin-top: 16px;
  }
`;

const SettingPage = () => {
  const discord = "";
  const telegram = "manotien";
  const telegramBot = "https://t.me/manotien_bot";

  return (
    <SettingPageStyle>
      <MainLayout>
        <Title level={3}>Settings</Title>

        <div className="connect-title">
          <img className="social-icon" src="/discord.svg" alt="icon" />
          <Title level={4}>Discord Connect</Title>
        </div>

        <div className="connect-description">
          <Paragraph strong>
            To connect with Discord, you have to verify that you own Discord account by following the steps below.
          </Paragraph>
          <Paragraph strong>
            1. join this channel https://discord.gg/qYFaBM5j
          </Paragraph>
          <img className="discord-verify-image" src="/discord-verify.image" alt="discord-verify" />
        </div>
        {/* <Card style={{ width: 300, marginTop: 16 }} loading={false}>
          <Meta
            avatar={}
            title="Connect Discord"
            description="To connect Discord, you have to join this channel https://discord.gg/qYFaBM5j"
          />
        </Card> */}
        <div className="social-container">
          <img className="social-icon" src="/discord.svg" alt="icon" />
          {discord ? (
            <Button type="link" size="large">
              {discord}
            </Button>
          ) : (
            <Button type="link" size="large">
              Connect to Discord
            </Button>
          )}
        </div>
        <div className="social-container">
          <img className="social-icon" src="/telegram.svg" alt="icon" />
          {telegram ? (
            <Button type="link" size="large">
              @{telegram}
            </Button>
          ) : (
            <Button type="link" size="large" href={telegramBot} target="_blank">
              Connect to Telegram
            </Button>
          )}
        </div>
      </MainLayout>
    </SettingPageStyle>
  );
};

export default SettingPage;
