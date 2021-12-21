import styled from "styled-components";
import {Avatar, Layout, Menu, Typography} from "antd";
import {UserOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CategoriesManagement from "./CategoriesManagement";
import ProductManagement from "./ProductManagement";
import UserManagement from "./UserManagement";
import OrderManagement from "./OrderManagement";

const {Content, Sider} = Layout;
const {Text} = Typography;

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

const adminComponent = [
    {
        key: "categories",
        title: "Categories Management",
        view: <CategoriesManagement/>
    },
    {
        key: "products",
        title: "Products Management",
        view: <ProductManagement/>
    },
    {
        key: "users",
        title: "Users Management",
        view: <UserManagement/>
    },
    {
        key: "orders",
        title: "Orders Management",
        view: <OrderManagement/>
    },
];

const BaseAdmin = () => {
    const {profile} = useSelector((state) => state.user);
    const [selectedView, setSelectedView] = useState(adminComponent[0]);

    const onViewChange = ({key}) => {
        const component = adminComponent.find((e) => e.key === key);
        if (!component) return;
        setSelectedView(component);
    }

    return (
        <Container>
            <Content style={{padding: '0 8%'}}>
                <Layout style={{height: '100%'}}>
                    <Sider width={200} collapsed={false} collapsible={false} reverseArrow={false}>
                        <Menu
                            mode="inline"
                            theme="light"
                            defaultSelectedKeys={[selectedView.key]}
                            onSelect={onViewChange}
                            style={{height: '100%', borderRight: "unset"}}
                        >
                            <GeneralProfile>
                                <Avatar size={36} style={{backgroundColor: '#87d068'}} icon={<UserOutlined/>}/>
                                <ProfileNames>
                                    <Text type="secondary">Administrator</Text>
                                    {/* eslint-disable-next-line no-mixed-operators */}
                                    <h4 style={{marginTop: '7px'}}>{profile && profile.name || "Yamee"}</h4>
                                </ProfileNames>
                            </GeneralProfile>
                            <Menu.Item key="categories" icon={<CategoryIcon style={{fontSize: '15px'}}/>}>
                                Categories
                            </Menu.Item>
                            <Menu.Item key="products" icon={<InventoryIcon style={{fontSize: '15px'}}/>}>
                                Products
                            </Menu.Item>
                            <Menu.Item key="users" icon={<ManageAccountsIcon style={{fontSize: '15px'}}/>}>
                                Users
                            </Menu.Item>
                            <Menu.Item key="orders" icon={<ShoppingCartOutlinedIcon style={{fontSize: '15px'}}/>}>
                                Orders
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
}

export default BaseAdmin;