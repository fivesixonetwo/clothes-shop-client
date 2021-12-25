import styled from "styled-components";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Avatar, Layout, Menu, Typography} from 'antd';
import {LaptopOutlined, UserOutlined} from "@ant-design/icons";
import ProfileEditor from "../components/ProfileEditor";
import ShippingAddress from "../components/ShippingAddress";
import {useLocation} from 'react-router-dom';
import Ordered from "../components/Ordered";
import EventNoteIcon from '@mui/icons-material/EventNote';

const Container = styled.div`
  display: flex;
  flex: 1;
  margin-top: 0.5px;
  margin-bottom: 1px;
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

const profileComponent = [
    {
        key: "profile",
        title: "My Profile",
        view: <ProfileEditor/>
    },
    {
        key: "shipping-address",
        title: "My Shipping Address",
        view: <ShippingAddress/>
    },
    {
        key: "order",
        title: "My Order",
        view: <Ordered/>
    },
];

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Profile = () => {
    let query = useQuery();

    const {profile} = useSelector((state) => state.user);
    const [selectedView, setSelectedView] = useState(profileComponent[0]);

    const onMenuChange = ({key}) => {
        const component = profileComponent.find((e) => e.key === key);
        if (!component) return;
        setSelectedView(component);
    }

    useEffect(() => {
        const tab = query.get("tab");
        if (tab) {
            const component = profileComponent.find((e) => e.key === tab);
            if (!component) return;
            setSelectedView(component);
        }
    }, []);

    return (
        <Container>
            <Content style={{padding: '0 8%'}}>
                <Layout style={{height: '100%'}}>
                    <Sider width={200} collapsed={false} collapsible={false} reverseArrow={false}>
                        <Menu
                            mode="inline"
                            theme="light"
                            selectedKeys={[selectedView.key]}
                            onSelect={onMenuChange}
                            style={{height: '100%', borderRight: "unset"}}
                        >
                            <GeneralProfile>
                                <Avatar size={36} style={{backgroundColor: '#87d068'}} icon={<UserOutlined/>}/>
                                <ProfileNames>
                                    <Text type="secondary">Your Profile</Text>
                                    <h4 style={{marginTop: '7px'}}>{(profile && profile.name) || "Yamee"}</h4>
                                </ProfileNames>
                            </GeneralProfile>

                            <Menu.Item key="profile" icon={<UserOutlined/>}>
                                Profile
                            </Menu.Item>
                            <Menu.Item key="shipping-address" icon={<LaptopOutlined/>}>
                                Shipping Address
                            </Menu.Item>
                            <Menu.Item key="order" icon={<EventNoteIcon fontSize={"large"}/>}>
                                My Order
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
                        <h3>{selectedView.title}</h3>
                        <InnerContainer>
                            {selectedView.view}
                        </InnerContainer>
                    </Content>
                </Layout>
            </Content>
        </Container>
    );
};

export default Profile;
