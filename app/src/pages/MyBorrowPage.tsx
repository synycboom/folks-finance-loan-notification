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
  const { account } = useAccount();
  const [loans, setLoans] = useState<Loan[] | null>();

  useEffect(() => {
    if (account.address) {
      getLoans(account.address).then((loans) => setLoans(loans));
    }
  }, [account.address]);

  return (
    <MyBorrowPageStyle>
      <MainLayout>
        <Title level={3}>My Borrows</Title>
        <div className="container">
          {loans ? (
            loans?.map((loan) => <BorrowCard loan={loan} />)
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
