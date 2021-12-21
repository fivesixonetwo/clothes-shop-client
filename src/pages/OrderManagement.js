import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const OrderManagement = () => {
    return (
        <Container>
            <span>This is Invoice management page</span>
        </Container>
    );
};

export default OrderManagement;
