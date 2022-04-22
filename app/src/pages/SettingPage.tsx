import styled from "styled-components";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import Tag from 'antd/lib/tag';
import Empty from 'antd/lib/empty';
import Divider from 'antd/lib/divider';
import MainLayout from "../components/MainLayout";
import { useUser } from "../helpers/user";
import { useEffect } from "react";

const SettingPageStyle = styled.div`
  .connect-icon {
    width: 20px;
    margin-right: 8px;
  }

  .connect-title {
    margin-top: 32px;
    display: flex;
    align-items: center;
  }

  .connect-title-text {
    margin-bottom: 0;
  }

  .connect-description {
    margin-top: 16px;
  }

  .connect-image {
    margin-bottom: 8px;
  }

  .connected-account {
    margin-top: 16px;
    display: flex;
    align-items: center;
  }
`;

const SettingPage = () => {
  const { fetchUser, user } = useUser();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <SettingPageStyle>
      <MainLayout>
        <Title level={3}>Settings</Title>

        {user.discordUserName && <Tag color="purple">Your Discord {user.discordUserName} has been connected</Tag>}

        {user.telegramUsername && <Tag color="blue">Your Telegram {user.telegramUsername} has been connected</Tag>}

        {(!user.discordUserName && !user.telegramUsername) && (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={
            <span>
              No connected account. Please see how to connect below.
            </span>
          }/>
        )}

        <Divider orientation='left'>How to connect</Divider>

        <div className="connect-title">
          <img className="connect-icon" src="/discord.svg" alt="icon" />
          <Title className="connect-title-text" level={4}>Discord Connect</Title>
        </div>

        <div className="connect-description">
          <Paragraph strong>
            To connect with Discord, you have to verify that you own Discord account by following the steps below.
          </Paragraph>
          <Paragraph strong>
            1. Join this channel https://discord.gg/qYFaBM5j
          </Paragraph>
          <Paragraph strong>
            2. Go to "general" text channel and enter !verify. After that our bot will send you a direct message.
          </Paragraph>
          <img className="connect-image" src="/discord-verify.png" alt="discord-verify" />
          <Paragraph strong>
            4. Copy the connect token with the command below.
          </Paragraph>
          <Paragraph code copyable>
            { `!connect ${user.discordConnectToken}` }
          </Paragraph>
          <Paragraph strong>
            5. Go to your DM with the bot and enter the text you have copied in the clipboard.
          </Paragraph>
          <img className="connect-image" src="/discord-connect.png" alt="discord-connect" />
        </div>

        <Divider dashed/>

        <div className="connect-title">
          <img className="connect-icon" src="/telegram.svg" alt="icon" />
          <Title className="connect-title-text" level={4}>Telegram Connect</Title>
        </div>

        <div className="connect-description">
          <Paragraph strong>
            To connect with Telegram, you have to verify that you own Telegram account by following the steps below.
          </Paragraph>
          <Paragraph strong>
            1. Join this channel https://t.me/folks_finance_notification_bot, and cilck "start"
          </Paragraph>
          <img className="connect-image" src="/telegram-start.png" alt="start-telegram" />
          <br />
          <img className="connect-image" src="/telegram-started.png" alt="started-telegram" />
          <Paragraph strong>
            2. Copy the connect token with the command below.
          </Paragraph>
          <Paragraph code copyable>
            { `/connect ${user.telegramConnectToken}` }
          </Paragraph>
          <Paragraph strong>
            3. Enter the text you have copied in the clipboard.
          </Paragraph>
          <img className="connect-image" src="/telegram-connected.png" alt="connected-telegram" />
        </div>
      </MainLayout>
    </SettingPageStyle>
  );
};

export default SettingPage;
