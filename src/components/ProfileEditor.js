import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {getProfile, updateProfile} from "../redux/apiCalls";
import {Button, Form, Input} from "antd";

const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const ProfileEditor = () => {
    const dispatch = useDispatch();
    const {profile} = useSelector((state) => state.user);
    useEffect(() => {
        dispatch(getProfile());
    }, []);


    const onFinish = (profile) => {
        dispatch(updateProfile(profile));
    }

    return (
        <Container>
            <Form style={{flex: 1, alignItems: "center"}}
                  labelCol={{span: 8}}
                  wrapperCol={{span: 8}}
                  onFinish={onFinish}
                  initialValues={{name: profile && profile.name || ""}}
                  layout={"horizontal"}
                  autoComplete="off"
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{required: true, message: 'Please input your username!'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true, message: 'Please input your password!'}]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item
                    dependencies={['password']}
                    label="Confirm Password"
                    name="confirm"
                    rules={[{required: true, message: 'Please input your confirm password!'},
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                        })]}
                >
                    <Input.Password/>
                </Form.Item>
                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        Update
                    </Button>
                </Form.Item>
            </Form>
        </Container>
    );
};

export default ProfileEditor;
