import styled from "styled-components";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {Avatar, Layout, Menu, Typography} from 'antd';
import {LaptopOutlined, UserOutlined} from "@ant-design/icons";
import ProfileEditor from "../components/ProfileEditor";
import ShippingAddress from "../components/ShippingAddress";

const Container = styled.div`
  display: flex;
  flex: 1;
  margin-top: 0.5px;
`;

const GeneralProfile = styled.div`
  display: flex;
  padding: 10px;
  flex-direction: row;
`

const ProfileNames = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  justify-content: space-around;
`

const InnerContainer = styled.div`
  display: flex;
  flex: 1;
  padding: 10px;
  margin-top: 10px;
  border-radius: 10px;
  background-color: var(--bgSecondary);
`

const {Content, Sider} = Layout;
const {Text} = Typography;

const Profile = () => {
    const {profile} = useSelector((state) => state.user);
    const [selectedMenu, setSelectedMenu] = useState("profile");

    const onMenuChange = ({key}) => {
        setSelectedMenu(key);
    }

    return (
        <Container>
            <Content style={{padding: '0 8%'}}>
                <Layout style={{height: '100%'}}>
                    <Sider width={200} collapsed={false} collapsible={false} reverseArrow={false}>
                        <Menu
                            mode="inline"
                            theme="light"
                            defaultSelectedKeys={[selectedMenu]}
                            onSelect={onMenuChange}
                            style={{height: '100%', borderRight: "unset"}}
                        >
                            <GeneralProfile>
                                <Avatar size={36} style={{backgroundColor: '#87d068'}} icon={<UserOutlined/>}/>
                                <ProfileNames>
                                    <Text type="secondary">Administrator</Text>
                                    <h4 style={{marginTop: '7px'}}>{profile && profile.name || "Yamee"}</h4>
                                </ProfileNames>
                            </GeneralProfile>

                            <Menu.Item key="profile" icon={<UserOutlined/>}>
                                Profile
                            </Menu.Item>
                            <Menu.Item key="shipping-address" icon={<LaptopOutlined/>}>
                                Shipping Address
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Content style={{
                        display: "flex",
                        flex: 1,
                        flexDirection: "column",
                        padding: '20px 25px',
                        minHeight: 300,
                        backgroundColor: "white"
                    }}>
                        <h3>My Profile</h3>
                        <InnerContainer>
                            {selectedMenu === "profile" && <ProfileEditor/>}
                            {selectedMenu === "shipping-address" && <ShippingAddress/>}
                        </InnerContainer>
                    </Content>
                </Layout>
            </Content>
        </Container>
    );
};

export default Profile;
