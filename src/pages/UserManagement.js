import styled from "styled-components";
import {Avatar, Popconfirm, Switch, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {UserOutlined} from "@ant-design/icons";
import {getUsers, toggleUserStatus} from "../redux/apiCalls";

const Container = styled.div`
  display: flex;
  flex: 1;
`;
const UserManagement = () => {

    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        refreshUsers();
    }, []);

    const refreshUsers = () => {
        dispatch(getUsers()).then((r) => {
            setUsers(r.data);
        });
    }

    const onToggleUserStatus = (record) => {
        dispatch(toggleUserStatus(record.id)).then(() => refreshUsers());
    }

    const userColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 50,
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            width: 150,
            render: (avatar) => {
                return (
                    <Avatar style={{backgroundColor: '#87d068'}} size={32} icon={<UserOutlined/>}/>
                )
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 300,
            key: 'email',
        },
        {
            title: 'Role',
            key: 'role',
            dataIndex: 'role',
            render: (role) => (
                <Tag color={role === "ROLE_ADMIN" ? 'cyan' : "success"}>
                    {role}
                </Tag>
            )
        },
        {
            title: "Status",
            key: 'enabled',
            dataIndex: "enabled",
            width: 150,
            render: (enabled, record) => {
                return <Popconfirm disabled={record.role === "ROLE_ADMIN"}
                                   title={"Are you sure you want to " + (enabled ? "disable" : "enable") + " this user?"}
                                   okText="Yes"
                                   onConfirm={() => onToggleUserStatus(record)}
                                   cancelText="No"
                >
                    <Switch
                        checked={enabled}
                        disabled={record.role === "ROLE_ADMIN"}
                        checkedChildren="Enabled"
                        unCheckedChildren="Disabled"/>
                </Popconfirm>
            }
        },
        {
            title: 'Created Time',
            width: 180,
            dataIndex: 'createdAt',
            key: 'createdAt',
        }
    ];

    return (
        <Container>
            <Table style={{flex: 1}}
                   rowKey={"id"}
                   dataSource={users}
                   columns={userColumns}/>
        </Container>
    );
};

export default UserManagement;
