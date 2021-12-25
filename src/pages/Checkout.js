import styled from "styled-components";
import {Button, Divider, Image, Space, Table, Typography} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {BASE_URL} from "../helpers/axiosInstance";
import {useHistory} from "react-router-dom";
import {useEffect, useState} from "react";
import {getShippingAddress, placeOrder} from "../redux/apiCalls";
import RoomIcon from '@mui/icons-material/Room';
import AddressSelectionDialog from "../components/AddressSelectionDialog";
import TextArea from "antd/lib/input/TextArea";
import {useSnackbar} from "notistack";
import {resetCart} from "../redux/cartRedux";

const {Text} = Typography;

const Container = styled.div`
  flex: 1;
  margin-bottom: 2px;
  margin-top: 0.5px;
  flex-direction: column;
  background-color: var(--bgSecondary);
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
  margin: 0 12%;
  display: flex;
  flex: 1;
  flex-direction: column;

  & > * {
    margin-top: 20px;
  }
`

const AddressSelector = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border-radius: 3px;
  background-color: white;
  box-shadow: 0 1px 1px 0 rgb(0 0 0 / 5%);

  & > .Coloring {
    height: 3px;
    width: 100%;
    background-position-x: -30px;
    background-size: 116px 3px;
    background-image: repeating-linear-gradient(45deg, #6fa6d6, #6fa6d6 33px, transparent 0, transparent 41px, #f18d9b 0, #f18d9b 74px, transparent 0, transparent 82px);
  }

  & > .Content {
    padding: 20px;

    & > .Title {
      display: flex;

    }
  }
`

const AddressItem = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Mark = styled.div`
  padding: 1.5px 5px;
  background-color: #00bfa5;
  color: white;
  font-size: 12px;
  margin-left: 10px;
  border-radius: 4px;
`;

const SummaryContainer = styled.div`
  display: flex;
  flex: 1;
  margin-top: 40px;
  margin-bottom: 20px;
  justify-content: flex-end;
`

const Summary = styled.div`
  padding: 20px 30px;
  border: .1rem dashed #d7d7d7;
  background-color: #f9f9f9;
  min-width: 500px;
  align-items: flex-end;
`

const Detail = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;

  & > .Label {
    width: 100px;
  }

  & > .Value {
    flex: 1;
    text-align: end;
  }

  &:not(:first-child) {
    margin-top: 15px;
  }
`

const Checkout = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();

    const {items} = useSelector((state) => state.cart);
    const [address, setAddress] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addressSelectionVisible, setAddressSelectionVisible] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        refreshShippingAddress();
    }, []);

    useEffect(() => {
        if (!address.length) return;

        const index = address.findIndex(item => item.default);
        if (index !== -1) {
            setSelectedAddress(address[index]);
        } else {
            setSelectedAddress(address[0]);
        }
    }, [address]);

    const refreshShippingAddress = () => {
        dispatch(getShippingAddress()).then((r) => {
            setAddress(r.data);
        });
    }

    const onShippingAddressChange = (id) => {
        if (id) {
            const index = address.findIndex(item => item.id === id);
            setSelectedAddress(address[index]);
        }
        setAddressSelectionVisible(false);
    }

    const onMessageChange = (e) => {
        setMessage(e.target.value);
    }

    const onClickOnProduct = (id) => {
        history.push("/products/" + id);
    }

    const onClickPlaceOrder = () => {
        if (!items || !items.length) {
            enqueueSnackbar("No items to order.", {variant: "error"});
            return;
        }
        if (!selectedAddress) {
            enqueueSnackbar("Please choose shipping address.", {variant: "error"});
            return;
        }

        let orderItems = [];
        items.forEach((item) => {
            if (!item.selectedVariant) {
                enqueueSnackbar(`Item ${item.name} doesn't has any variant`, {variant: "error"});
                return;
            }
            if (item.quantity > 0) {
                orderItems.push({productId: item.id, variantId: item.selectedVariant.id, quantity: item.quantity || 0});
            }
        })
        if (!orderItems.length) {
            enqueueSnackbar("No items to order.", {variant: "error"});
            return;
        }

        const body = {
            message,
            shippingAddress: selectedAddress,
            shippingFee: 0,
            orderItems
        };
        dispatch(placeOrder(body)).then((res) => {
            if (res) {
                dispatch(resetCart());
                history.replace("/checkout-success", {order: res.data});
            }
        });
    }

    const onClickAddress = () => {
        if (selectedAddress) {
            setAddressSelectionVisible(true);
        } else {
            history.replace("/profile?tab=shipping-address");
        }
    }

    const columns = [
        {
            title: 'Product',
            dataIndex: 'name',
            key: 'product',
            render: (name, record) => {
                const thumbnail = [].concat(record.images).find(img => img.type === "THUMBNAIL");
                return (
                    <Space size="large">
                        <Image
                            height={45}
                            width={45}
                            style={{cursor: "pointer"}}
                            preview={true}
                            src={BASE_URL + "products/images/" + thumbnail.url}
                        />
                        <h4 onClick={() => onClickOnProduct(record.id)} style={{cursor: "pointer"}}>{record.name}</h4>
                    </Space>
                )
            }
        },
        {title: 'Variant', dataIndex: ["selectedVariant", 'variantString'], key: 'variantString', width: 220},
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 80,
        },
        {
            title: 'Unit Price',
            dataIndex: ['selectedVariant', 'price'],
            align: "right",
            key: 'price',
            width: 120,
            render: (value) => <Text strong>${value}</Text>
        },
        {
            title: 'Subtotal',
            dataIndex: 'total',
            align: "right",
            width: 160,
            key: 'total',
            render: (value, record) => {
                const total = (record['selectedVariant']['price'] * (record['quantity'] || 1));
                return (
                    <Text style={{color: "#ee4d2d"}} strong>${total}</Text>
                )
            }
        }
    ];

    return (
        <Container>
            <PageHeader>
                <p>Checkout</p>
            </PageHeader>
            <Content>
                <AddressSelector>
                    <div className={"Coloring"}/>
                    <div className={"Content"}>
                        <div className={"Title"}><RoomIcon style={{color: "#ee4d2d"}}/><h3
                            style={{color: "#ee4d2d", marginLeft: 10}}>Delivery Address</h3>
                        </div>
                        <div style={{marginTop: 10, display: "flex", flexDirection: "row"}}>
                            {
                                selectedAddress ? <AddressItem>
                                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                        <h4>{selectedAddress.name}</h4>
                                        {selectedAddress.default && <Mark>Default</Mark>}
                                    </div>
                                    <span><Text
                                        type="secondary"
                                        style={{marginRight: 5}}>Address: </Text>{selectedAddress.address} - {selectedAddress.ward} - {selectedAddress.district} - {selectedAddress.city}</span>
                                    <span><Text style={{marginRight: 5}}
                                                type="secondary">Phone number: </Text>{selectedAddress.phoneNumber}</span>
                                </AddressItem> : <div style={{flex: 1}}>
                                    <Text type={"secondary"} style={{fontSize: 15}}>No shipping address, please add
                                        one!</Text>
                                </div>
                            }
                            <div>
                                <Button
                                    onClick={onClickAddress}
                                    type="primary"
                                    danger
                                    size={"small"}
                                    htmlType="submit">
                                    {selectedAddress ? "Change Address" : "Add Address"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </AddressSelector>
                <Table title={() => <h3 style={{color: "#ee4d2d"}}>Product Ordered</h3>} pagination={false}
                       footer={() => {
                           return (
                               <Space>
                                   <Text type="secondary">Message</Text>
                                   <TextArea onChange={onMessageChange} allowClear={true} rows={1} style={{width: 400}}
                                             contentEditable={false}
                                             placeholder={"(Optional) Leave us a message"}/>
                               </Space>
                           )
                       }}
                       style={{flex: 1}} dataSource={items}
                       columns={columns}/>
                <SummaryContainer>
                    <Summary>
                        <h4 style={{texAlign: "center"}}>YOUR ORDER</h4>
                        <Divider style={{marginTop: 12, marginBottom: 15}}/>
                        <Detail>
                            <Text className={"Label"}>Subtotal:</Text>
                            <Text
                                className={"Value"}>${items.reduce((sum, item) => sum + item.selectedVariant['price'] * item.quantity, 0)}</Text>
                        </Detail>
                        <Detail>
                            <Text className={"Label"}>Shipping fee:</Text>
                            <Text className={"Value"}>$0</Text>
                        </Detail>
                        <Detail>
                            <Text strong className={"Label"}>Total
                                ({items.length} {items.length > 1 ? "items" : "item"}):</Text>
                            <Text style={{color: "#ee4d2d"}} strong
                                  className={"Value"}>${items.reduce((sum, item) => sum + item.selectedVariant['price'] * item.quantity, 0)}</Text>
                        </Detail>
                        <div style={{justifyContent: "flex-end", display: "flex", marginTop: 30}}>
                            <Button
                                onClick={onClickPlaceOrder}
                                disabled={!items.length}
                                type="primary"
                                danger
                                block
                                size={"large"}
                                htmlType="submit">
                                Place Order
                            </Button>
                        </div>
                    </Summary>
                </SummaryContainer>
            </Content>
            <AddressSelectionDialog selected={selectedAddress}
                                    address={address}
                                    onOk={onShippingAddressChange}
                                    visible={addressSelectionVisible}
                                    onCancel={() => setAddressSelectionVisible(false)}/>
        </Container>
    );
};

export default Checkout;
