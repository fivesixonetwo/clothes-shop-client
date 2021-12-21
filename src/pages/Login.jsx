import styled from "styled-components";
import {mobile} from "../responsive";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {getProfile, login} from "../redux/apiCalls";
import {Button, Form, Input} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";

const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  background: url("https://i.pinimg.com/originals/6c/d1/14/6cd1142f5dd232ff8d79e6b26f646b76.jpg");
  background-size: cover;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 25%;
  display: flex;
  flex-direction: column;
  padding: 20px 25px;
  border-radius: 10px;
  background-color: var(--bgSecondary);
  ${mobile({width: "75%"})}
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const CustomTitle = styled.h1`
  font-size: 24px;
  font-weight: 300;
`

const Login = () => {
    const dispatch = useDispatch();
    const {isFetching} = useSelector((state) => state.user);
    const history = useHistory();

    const onSubmitForm = (values) => {
        dispatch(login(values)).then((r) => {
            if (r && r.response) {
                dispatch(getProfile());
            }
        });
    }

    return (
        <Container>
            <Wrapper>
                <Title>
                    <CustomTitle>SIGN IN</CustomTitle>
                </Title>
                <Form
                    onFinish={onSubmitForm}
                    name="login_form"
                    size={"middle"}
                >
                    <Form.Item
                        name="email"
                        rules={[{required: true, message: 'Please input your Username!'}]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Email"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: 'Please input your Password!'}]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"

                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item className={"LoginButton"} style={{marginTop: "20px"}}>
                        <Button disabled={isFetching} type="primary" htmlType="submit" block>
                            Log in
                        </Button>
                        Or<Button onClick={() => history.replace("/register")} size={"small"} type="link">Register
                        now!</Button>
                    </Form.Item>
                </Form>
            </Wrapper>
        </Container>
    );
};

export default Login;
