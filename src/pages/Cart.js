import styled from "styled-components";
import {Button, Image, Space, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {BASE_URL} from "../helpers/axiosInstance";
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ClearIcon from '@mui/icons-material/Clear';
import {removeCartItem} from "../redux/apiCalls";

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

const CartInfo = styled.div`
  margin-left: 30px;
  display: flex;
  flex-direction: column;
  padding: 10px 30px;
  align-items: center;
  min-width: 220px;
  border: .1rem dashed #d7d7d7;
  background-color: #f9f9f9;
`

const Cart = () => {

    const dispatch = useDispatch();
    const {items} = useSelector((state) => state.cart);

    const removeItem = (item) => {
        dispatch(removeCartItem(item));
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
                            preview={false}
                            src={BASE_URL + "products/images/" + thumbnail.url}
                        />
                        <h4 style={{cursor: "pointer"}}>{record.name}</h4>
                    </Space>
                )
            }
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: '',
            width: 100,
            key: 'action',
            render: (value, record) => (
                <Space size="small">
                    <Button onClick={() => removeItem(record)} disabled={record.deleted} type="text" shape={"default"}
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
                <Table style={{flex: 1}} dataSource={items} columns={columns}/>
                <CartInfo>
                    <h4>Checkout</h4>
                    <Button style={{display: "flex", justifyContent: "center", alignItems: "center"}} type="primary"
                            htmlType="submit" block icon={<ShoppingCartCheckoutIcon/>}>
                        Checkout
                    </Button>
                </CartInfo>
            </Content>
        </Container>
    );
};

export default Cart;
