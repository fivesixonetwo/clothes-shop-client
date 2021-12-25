import styled from "styled-components";
import {Button, Result} from "antd";
import {useHistory, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";

const Container = styled.div`
  flex: 1;
  display: flex;
  margin-bottom: 2px;
  margin-top: 0.5px;
  flex-direction: column;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

const SuccessCheckout = () => {

    const history = useHistory();
    const location = useLocation();
    const [order, setOrder] = useState(null);

    const onClickContinue2Shopping = () => {
        history.replace("/");
    }

    useEffect(() => {
        if (location.state && location.state.order) {
            setOrder(location.state.order);
        }
    }, [location]);

    return (
        <Container>
            <Result
                status="success"
                title="Thank you for your purchased!"
                subTitle={
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <span>You order number is: <b>#{order && order['orderNumber']}</b>.</span>
                        <span>You can check your order status at your profile page.</span>
                    </div>
                }
                extra={[
                    <Button onClick={onClickContinue2Shopping} type={"primary"} key="buy">Continue to Shopping</Button>,
                ]}
            />,
        </Container>
    );
};

export default SuccessCheckout;
