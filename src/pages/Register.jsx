import styled from "styled-components";
import {mobile} from "../responsive";
import {Button, Form, Input} from "antd";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {register} from "../redux/apiCalls";

const Container = styled.div`
  flex: 1;
  background: linear-gradient(rgba(255, 255, 255, 0.5),
  rgba(255, 255, 255, 0.5)),
  url("https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940") center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 30%;
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

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 7},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
};

const Register = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const clickRegister = (values) => {
        dispatch(register(values));
    }

    return (
        <Container>
            <Wrapper>
                <Title>
                    <CustomTitle>CREATE AN ACCOUNT</CustomTitle>
                </Title>
                <Form
                    {...formItemLayout}
                    name="login_form"
                    onFinish={clickRegister}
                    size={"middle"}
                >
                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                            {
                                min: 6,
                                message: 'Password must be minimum 6 characters.',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Nickname"
                        tooltip="What do you want others to call you?"
                        rules={[{
                            required: true,
                            message: 'Please input your nickname!',
                            whitespace: true
                        }, {
                            min: 4,
                            message: 'Nickname must be minimum 4 characters.',
                        }]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item wrapperCol={{...formItemLayout.wrapperCol, offset: 7}} className={"LoginButton"}
                               style={{marginTop: "20px"}}>
                        <Button disabled={false} type="primary" htmlType="submit" block>
                            Register
                        </Button>
                        Already have an account?<Button onClick={() => history.replace("/login")} size={"small"}
                                                        type="link">Login now!</Button>
                    </Form.Item>
                </Form>
            </Wrapper>
        </Container>
    );
};

export default Register;
