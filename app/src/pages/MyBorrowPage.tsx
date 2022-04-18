import styled from "styled-components";
import Typography from "antd/lib/typography";
import MainLayout from "../components/MainLayout";
import BorrowCard from "../components/BorrowCard";

const { Title } = Typography;

const MyBorrowPageStyle = styled.div``;

const MyBorrowPage = () => {
  return (
    <MyBorrowPageStyle>
      <MainLayout>
        <Title level={3}>My Borrows</Title>
        <BorrowCard />
        <BorrowCard />
      </MainLayout>
    </MyBorrowPageStyle>
  );
};

export default MyBorrowPage;
