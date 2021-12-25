import styled from "styled-components";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {cancelOrder, getMyOrders} from "../redux/apiCalls";
import {Button, Image, Popconfirm, Space, Table, Tooltip, Typography} from "antd";
import CancelIcon from '@mui/icons-material/Cancel';
import {BASE_URL} from "../helpers/axiosInstance";

const {Text} = Typography;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const AddressItem = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Ordered = () => {
    const dispatch = useDispatch();

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        refreshOrder();
    }, []);

    const refreshOrder = () => {
        dispatch(getMyOrders()).then((res) => {
            if (res.data) {
                setOrders(res.data);
            }
        });
    }

    const onCancelOrder = (id) => {
        dispatch(cancelOrder(id)).then(() => {
            refreshOrder();
        });
    }

    const orderItemColumns = [
        {
            title: 'Items',
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
        {title: 'Variant', dataIndex: ["variant", 'variantString'], key: 'variantString', width: 200},
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 75,
        },
        {
            title: 'Unit Price',
            dataIndex: 'unitPrice',
            align: "right",
            key: 'price',
            width: 100,
            render: (value) => <Text strong>${value}</Text>
        },
        {
            title: 'Subtotal',
            dataIndex: 'Subtotal',
            align: "right",
            width: 100,
            key: 'Subtotal',
            render: (value, record) => {
                const subTotal = record.quantity * record.unitPrice;
                return (
                    <Text style={{color: "#ee4d2d"}} strong>${subTotal}</Text>
                )
            }
        }
    ];

    const nestedRowRenderer = (record) => {
        return (
            <Space style={{display: "flex", flex: 1}} direction={"vertical"} size={"middle"}>
                <AddressItem>
                    <span style={{display: "flex"}}><Text
                        type="secondary"
                        style={{marginRight: 5}}>Shipping Address: </Text><h4>{record.name}</h4></span>
                    <span><Text
                        type="secondary"
                        style={{marginRight: 5}}>Address: </Text>{record.address} - {record.ward} - {record.district} - {record.city}</span>
                    <span><Text style={{marginRight: 5}}
                                type="secondary">Phone number: </Text>{record.phoneNumber}</span>
                </AddressItem>
                <Table locale={{emptyText: "No Items"}} size={"small"}
                       columns={orderItemColumns} pagination={false} dataSource={record.orderItems}/>
            </Space>
        )
    }

    const columns = [
        {
            title: 'Order Number',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
            width: 130
        },
        {
            title: 'Order Time',
            width: 180,
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Product',
            dataIndex: 'createdAt',
            key: 'products',
            render: (value, record) => {
                let productNames = record['orderItems'].map(item => item.variant['variantName']).join(", ");
                return (
                    <Text>{productNames}</Text>
                )
            }
        },
        {
            title: 'Total',
            dataIndex: 'total',
            align: "right",
            width: 100,
            key: 'total',
            render: (value, record) => {
                return (
                    <Text style={{color: "#ee4d2d"}} strong>${value}</Text>
                )
            }
        },
        {
            title: 'Order Status',
            width: 120,
            align: "right",
            dataIndex: 'orderStatus',
            key: 'orderStatus',
        },
        {
            title: 'Action',
            width: 150,
            dataIndex: "orderStatus",
            key: 'action',
            render: (value, record) => (
                <Popconfirm
                    title="Are you sure to cancel this order?"
                    okText="Yes"
                    onConfirm={() => onCancelOrder(record.id)}
                    disabled={value === "Shipped" || value === "Cancelled" || value === "Declined"}
                    cancelText="No"
                    key={record.id}
                >
                    <Tooltip key={record.id} title={"Cancel Order"}>
                        <Button disabled={value === "Shipped" || value === "Cancelled" || value === "Declined"} danger
                                type="text" shape={"default"}
                                icon={<CancelIcon fontSize={"small"}/>}/>
                    </Tooltip>
                </Popconfirm>
            ),
        }
    ]

    return (
        <Container>
            <Table pagination={false}
                   style={{flex: 1}}
                   rowKey={"id"}
                   dataSource={orders}
                   expandable={{expandedRowRender: nestedRowRenderer}}
                   columns={columns}/>
        </Container>
    );
};

export default Ordered;
