import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {getProfile, removeWishlistItem} from "../redux/apiCalls";
import {Button, Image, Popconfirm, Space, Table, Tooltip} from "antd";
import {BASE_URL} from "../helpers/axiosInstance";
import DeleteIcon from "@mui/icons-material/Delete";

const Container = styled.div`
  display: flex;
  flex: 1;
  margin-bottom: 2px;
  flex-direction: column;
  margin-top: 0.5px;
  background-color: white;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(https://d-themes.com/react/molla/demo-6/images/page-header-bg.jpg);
  padding: 2em;
  background-color: #ebebeb;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
  font-family: Quicksand, sans-serif;
  font-weight: 600;
  letter-spacing: 0.15em;
  font-size: 25px;
`

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  margin: 0 8%;
`
const Wishlist = () => {
    const dispatch = useDispatch();
    const {profile} = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getProfile());
    }, []);

    const onConfirmDelete = (record) => {
        dispatch(removeWishlistItem(record.id)).then(() => {
            dispatch(getProfile());
        });
    }

    const columns = [
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            render: (product) => {
                const thumbnail = [].concat(product.images).find(img => img.type === "THUMBNAIL");
                return (
                    <Space size="large">
                        <Image
                            height={45}
                            width={45}
                            style={{cursor: "pointer"}}
                            preview={true}
                            src={BASE_URL + "products/images/" + thumbnail.url}
                        />
                        <h4 style={{cursor: "pointer"}}>{product.name}</h4>
                    </Space>
                )
            }
        },
        {
            title: 'Created Time',
            width: 180,
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Action',
            width: 150,
            key: 'action',
            render: (value, record) => (
                <Tooltip title={"Delete"}>
                    <Popconfirm disabled={record.deleted}
                                title="Are you sure to delete this item?"
                                okText="Yes"
                                onConfirm={() => onConfirmDelete(record)}
                                cancelText="No"
                    >
                        <Button disabled={record.deleted} type="text" shape={"default"}
                                icon={<DeleteIcon sx={{color: "red"}} fontSize={"small"}/>}/>
                    </Popconfirm>
                </Tooltip>
            ),
        }
    ]

    return (
        <Container>
            <PageHeader>
                <p>Your Wishlist</p>
            </PageHeader>
            <Content>
                <Table style={{flex: 1}} dataSource={profile && profile['wishlist'] || []} columns={columns}/>
            </Content>
        </Container>
    );
};

export default Wishlist;
