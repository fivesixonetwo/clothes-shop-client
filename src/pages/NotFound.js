import React from 'react';
import {Button, Result} from "antd";
import {useHistory} from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const NotFound = () => {

    const history = useHistory();

    const back2Home = () => {
        history.replace("/");
    }

    return (
        <Container>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary" onClick={back2Home}>Back Home</Button>}
            />
        </Container>
    )
}

export default NotFound;