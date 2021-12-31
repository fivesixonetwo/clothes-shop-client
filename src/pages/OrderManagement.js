import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { changeOrderStatus, getAllOrder } from "../redux/apiCalls";
import { Button, Image, Space, Table, Tooltip, Typography } from "antd";
import EditIcon from '@mui/icons-material/Edit';
import { BASE_URL } from "../helpers/axiosInstance";
import OrderStatusDialog from "../components/OrderStatusDialog";

import { removeVietnameseTones } from '../helpers/utils';
import useSearchTable from '../hooks/useSearchTable';

const { Text } = Typography;

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const AddressItem = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const OrderManagement = () => {
    const dispatch = useDispatch();
    const [orders, setOrders] = useState([]);
    const [orderStatusVisible, setOrderStatusVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const { getColumnSearchProps } = useSearchTable();

    useEffect(() => {
        refreshOrder();
    }, []);

    const refreshOrder = () => {
        dispatch(getAllOrder()).then((r) => {
            setOrders(r.data);
        });
    }

    const onBeingChange = (orderId) => {
        setSelectedOrder(orderId);
        setOrderStatusVisible(true);
    }

    const onOk = (status) => {
        setOrderStatusVisible(false);
        dispatch(changeOrderStatus(selectedOrder, status)).then(() => {
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
                            style={{ cursor: "pointer" }}
                            preview={true}
                            src={BASE_URL + "products/images/" + thumbnail.url}
                        />
                        <h4 style={{ cursor: "pointer" }}>{product.name}</h4>
                    </Space>
                )
            }
        },
        { title: 'Variant', dataIndex: ["variant", 'variantString'], key: 'variantString', width: 200 },
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
                    <Text style={{ color: "#ee4d2d" }} strong>${subTotal}</Text>
                )
            }
        }
    ];

    const nestedRowRenderer = (record) => {
        return (
            <Space key={record.id} style={{ display: "flex", flex: 1 }} direction={"vertical"} size={"middle"}>
                <AddressItem key={record.id}>
                    <span style={{ display: "flex" }}><Text
                        type="secondary"
                        style={{ marginRight: 5 }}>Shipping Address: </Text><h4>{record.name}</h4></span>
                    <span><Text
                        type="secondary"
                        style={{ marginRight: 5 }}>Address: </Text>{record.address} - {record.ward} - {record.district} - {record.city}</span>
                    <span><Text style={{ marginRight: 5 }}
                        type="secondary">Phone number: </Text>{record.phoneNumber}</span>
                </AddressItem>
                <Table rowKey={record.id} locale={{ emptyText: "No Items" }} size={"small"}
                    columns={orderItemColumns} pagination={false} dataSource={record.orderItems} />
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
                    <Text style={{ color: "#ee4d2d" }} strong>${value}</Text>
                )
            }
        },
        {
            title: 'Order Status',
            width: 120,
            align: "right",
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            ...getColumnSearchProps('orderStatus'),
            sorter: (a, b) => {
                if (removeVietnameseTones(a.orderStatus.slice(0, 1)) < removeVietnameseTones(b.orderStatus.slice(0, 1))) { return -1; }
                if (removeVietnameseTones(a.orderStatus.slice(0, 1)) > removeVietnameseTones(b.orderStatus.slice(0, 1))) { return 1; }
                return 0;
            },
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Action',
            width: 150,
            dataIndex: "orderStatus",
            align: "right",
            key: 'action',
            render: (value, record) => (
                <Tooltip key={record.id} title={"Edit Order"}>
                    <Button
                        onClick={() => onBeingChange(record.id)}
                        type="text" shape={"default"}
                        icon={<EditIcon fontSize={"small"} />} />
                </Tooltip>
            ),
        }
    ]

    return (
        <Container>
            <Table pagination={false}
                style={{ flex: 1 }}
                rowKey={"id"}
                expandable={{ expandedRowRender: nestedRowRenderer }}
                dataSource={orders}
                columns={columns} />
            <OrderStatusDialog visible={orderStatusVisible}
                onOk={onOk}
                onCancel={() => setOrderStatusVisible(false)} />
        </Container>
    );
};

export default OrderManagement;
