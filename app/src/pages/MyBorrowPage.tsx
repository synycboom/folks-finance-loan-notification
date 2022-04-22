import styled from "styled-components";
import Typography from "antd/lib/typography";
import Spin from "antd/lib/spin";
import MainLayout from "../components/MainLayout";
import BorrowCard from "../components/BorrowCard";
import { useEffect, useState } from "react";
import { getLoans } from "../helpers/loan";
import { useAccount } from "../helpers/account";
import { Loan } from "../types";
import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import { getNotifications } from "../helpers/api";
import { useUser } from "../helpers/user";

const { Title } = Typography;

const MyBorrowPageStyle = styled.div`
  .container {
    display: flex;
    flex-direction: column;
    margin-top: 32px;

    .ant-spin {
      margin-top: 80px;
      .ant-spin-text {
        margin-top: 16px;
      }
    }
  }
`;

const MyBorrowPage = () => {
  const { fetchUser } = useUser();

  const { account } = useAccount();
  const [loans, setLoans] = useState<Loan[] | null>();

  const address = account.address;

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(address);
    if (address) {
      getLoanAndNotifications(address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const getLoanAndNotifications = async (address: string) => {
    const [loans, notifications] = await Promise.all([
      getLoans(account.address),
      getNotifications(),
    ]);

    const newLoans = loans.map((loan) => {
      const notification = notifications.find(
        (notification) =>
          notification.escrowAddress === loan.escrowAddress &&
          notification.userAddress === loan.userAddress &&
          notification.tokenPair === loan.tokenPair
      );
      const setting = notification && {
        notifyDiscord: notification.notifyDiscord,
        notifyTelegram: notification.notifyTelegram,
        targetHealthFactor: notification.targetHealthFactor,
      };
      return {
        ...loan,
        setting,
      };
    });

    setLoans(newLoans);
  };

  if (loans) console.log(loans[0]);

  return (
    <MyBorrowPageStyle>
      <MainLayout>
        <Title level={3}>My Borrows</Title>
        <div className="container">
          {loans ? (
            loans?.map((loan) => (
              <BorrowCard
                loan={loan}
                key={loan.escrowAddress}
                setting={loan.setting}
              />
            ))
          ) : (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} />}
              tip="Loading..."
            />
          )}
        </div>
      </MainLayout>
    </MyBorrowPageStyle>
  );
};

export default MyBorrowPage;
