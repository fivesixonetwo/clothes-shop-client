import styled from "styled-components";
import {Button, Divider, Image, InputNumber, Space, Table, Typography} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {BASE_URL} from "../helpers/axiosInstance";
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ClearIcon from '@mui/icons-material/Clear';
import {removeCartItem, updateCartItem} from "../redux/apiCalls";
import {useHistory} from "react-router-dom";
import {useSnackbar} from "notistack";

const {Text} = Typography;

const Container = styled.div`
  display: flex;
  flex: 1;
  margin-bottom: 2px;
  margin-top: 0.5px;
  flex-direction: column;
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
  flex-direction: row;
  margin: 0 12%;
`

const CartInfo = styled.div`
  margin-left: 30px;
  padding: 20px 30px;
  align-items: center;
  min-width: 250px;
  border: .1rem dashed #d7d7d7;
  background-color: #f9f9f9;
`

const Detail = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;

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

const Cart = () => {

    const currentUser = useSelector((state) => state.user.currentUser);
    const history = useHistory();
    const dispatch = useDispatch();
    const {items} = useSelector((state) => state.cart);
    const {enqueueSnackbar} = useSnackbar();

    const removeItem = (item) => {
        dispatch(removeCartItem(item));
    }

    const onClickOnProduct = (id) => {
        history.push("/products/" + id);
    }

    const onChangeQuantity = (quantity, record) => {
        dispatch(updateCartItem(quantity, record));
    }

    const onClickCheckout = () => {
        if (!currentUser) {
            enqueueSnackbar("You need to sign in first to process checkout.", {variant: "error"});
        } else {
            history.push("/checkout");
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
        {title: 'Variant', dataIndex: ["selectedVariant", 'variantString'], key: 'variantString', width: 200},
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (value, record) => <InputNumber onChange={(number) => onChangeQuantity(number, record)} min={1}
                                                    defaultValue={value || 1}/>
        },
        {
            title: 'Unit Price',
            dataIndex: ['selectedVariant', 'price'],
            align: "right",
            key: 'price',
            width: 100,
            render: (value) => <Text strong>${value}</Text>
        },
        {
            title: 'Subtotal',
            dataIndex: 'total',
            align: "right",
            width: 120,
            key: 'total',
            render: (value, record) => {
                const total = (record['selectedVariant']['price'] * (record['quantity'] || 1));
                return (
                    <Text style={{color: "#ee4d2d"}} strong>${total}</Text>
                )
            }
        },
        {
            title: '',
            width: 100,
            align: "right",
            key: 'action',
            render: (value, record) => (
                <Space size="small">
                    <Button danger onClick={() => removeItem(record)} disabled={record.deleted} type="text"
                            shape={"default"}
                            icon={<ClearIcon fontSize={"small"}/>}/>
                </Space>
            ),
        }
    ];

    return (
        <Container>
            <PageHeader>
                <p>Shopping Cart</p>
            </PageHeader>
            <Content>
                <Table pagination={false} style={{flex: 1}} dataSource={items} columns={columns}/>
                <CartInfo>
                    <h4 style={{texAlign: "center"}}>CHECKOUT</h4>
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
                        <Text className={"Label"}>Total ({items.length} {items.length > 1 ? "items" : "item"}):</Text>
                        <Text style={{color: "#ee4d2d"}} strong
                              className={"Value"}>${items.reduce((sum, item) => sum + item.selectedVariant['price'] * item.quantity, 0)}</Text>
                    </Detail>
                    <Button
                        disabled={!items.length}
                        style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: 40}}
                        type="primary"
                        onClick={onClickCheckout}
                        htmlType="submit" block icon={<ShoppingCartCheckoutIcon fontSize={"small"}/>}>
                        Checkout
                    </Button>
                </CartInfo>
            </Content>
        </Container>
    );
};

export default Cart;
