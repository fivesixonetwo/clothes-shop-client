import {FavoriteBorderOutlined, ShoppingCartOutlined} from "@material-ui/icons";
import {BASE_URL} from "../helpers/axiosInstance";
import {Card, Tooltip} from 'antd';
import {useDispatch} from "react-redux";
import {addItem2Wishlist, addItemToCart} from "../redux/apiCalls";
import {useHistory} from "react-router-dom";
import styled from "styled-components";

const {Meta} = Card;

const Footer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  margin-top: 15px;
  align-items: center;
`;

const CustomCard = styled(Card)`
  transition: box-shadow 0.3s, border-color 0.3s;

  &:hover {
    border-color: transparent;
    box-shadow: 5px 8px 24px 5px rgba(121, 123, 129, 0.6)
  }
`

const Icon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  cursor: pointer;

  &:hover {
    background-color: #e9f5f5;
    transform: scale(1.1);
  }
`;

const Price = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  font-weight: bold;
`

const Product = ({item}) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const getThumbnail = () => {
        if (!item) return null;
        const thumbnail = [].concat(item.images).find(img => img.type === "THUMBNAIL");
        return BASE_URL + "products/images/" + thumbnail.url;
    }

    const onClickAddItemToCart = () => {
        dispatch(addItemToCart(item));
    }

    const onAddWishlist = () => {
        dispatch(addItem2Wishlist(item));
    }

    const onClickViewDetail = () => {
        history.push("/products/" + item.id);
    }

    const getItemPrice = () => {
        if (item.variants.length) {
            return item.variants[0]['price'];
        }
        return 0;
    }

    return (
        <CustomCard
            style={{width: 250}}
            cover={<img style={{cursor: "pointer"}} onClick={onClickViewDetail} alt="example"
                        src={getThumbnail()}/>}>
            <Meta title={item.name}/>
            <Footer>
                <Tooltip title={"Add to Wishlist"}>
                    <Icon>
                        <FavoriteBorderOutlined onClick={onAddWishlist}/>
                    </Icon>
                </Tooltip>
                <Price>
                    <div>${getItemPrice()}</div>
                </Price>
                <Tooltip title={"Add to Cart"}>
                    <Icon>
                        <ShoppingCartOutlined onClick={onClickAddItemToCart}/>
                    </Icon>
                </Tooltip>
            </Footer>
        </CustomCard>
    );
};

export default Product;
