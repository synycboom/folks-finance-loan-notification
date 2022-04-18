import styled from "styled-components";
import Title from "antd/lib/typography/Title";
import Button from "antd/lib/button";

import MainLayout from "../components/MainLayout";

const SettingPageStyle = styled.div`
  .social-container {
    margin-bottom: 8px;
    .social-icon {
      width: 40px;
      margin-right: 8px;
    }
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
