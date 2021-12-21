import styled from "styled-components";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {addCategory, deleteCategory, getCategories, updateCategory} from "../redux/apiCalls";
import {Badge, Button, Popconfirm, Space, Table} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import CategoryForm from "../components/CategoryForm";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
`


const CategoriesManagement = () => {

    const dispatch = useDispatch();
    const [categories, setCategories] = useState([]);
    const [visible, setVisible] = useState(false);
    const [initialCategory, setInitialCategory] = useState({});

    useEffect(() => {
        refreshCategories();
    }, []);

    const categoryCallBack = (values) => {
        setVisible(false);
        if (initialCategory && initialCategory.id) {
            dispatch(updateCategory(values)).then(() => {
                refreshCategories();
            });
            return;
        }
        dispatch(addCategory(values)).then(() => {
            refreshCategories();
        });
    }

    const refreshCategories = () => {
        dispatch(getCategories()).then((res) => {
            setCategories(res.data);
        });
    }

    const deleteCategoryHandler = (id) => {
        dispatch(deleteCategory(id)).then(() => {
            refreshCategories();
        });
    }

    const editCategory = (category) => {
        setInitialCategory(category);
        setVisible(true);
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 100,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Status',
            dataIndex: 'enabled',
            width: 220,
            key: 'enabled',
            render: (enabled) => (
                <span>
            <Badge status={enabled ? "success" : "error"}/>
                    {enabled ? "Enabled" : "Disabled"}
          </span>
            ),
        },
        {
            title: 'Created Time',
            width: 220,
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Action',
            width: 150,
            key: 'action',
            render: (value, record) => (
                <Space size="small">
                    <Button type="link" onClick={() => editCategory(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this category?"
                        okText="Yes"
                        onConfirm={() => deleteCategoryHandler(record.id)}
                        cancelText="No"
                    >
                        <Button type="link" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        }
    ];

    return (
        <Container>
            <Actions>
                <Button onClick={() => {
                    setInitialCategory({});
                    setVisible(true);
                }} type="primary" icon={<PlusOutlined/>}>
                    Add New
                </Button>
            </Actions>
            <Table style={{flex: 1}}
                   rowKey={"id"}
                   dataSource={categories}
                   columns={columns}/>
            <CategoryForm onCancel={() => setVisible(false)}
                          visible={visible}
                          onCreate={categoryCallBack}
                          initialValue={initialCategory}/>
        </Container>
    );
};

export default CategoriesManagement;
