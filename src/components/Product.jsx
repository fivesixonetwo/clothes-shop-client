import {
  FavoriteBorderOutlined,
  ShoppingCartOutlined,
} from "@material-ui/icons";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { BASE_URL } from "../helpers/axiosInstance";
import { Card, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem2Wishlist,
  addItemToCart,
  getProfile,
  removeWishlistItem,
} from "../redux/apiCalls";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useEffect } from "react";

const { Meta } = Card;

const Footer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  margin-top: 15px;
  align-items: center;
`;

const CustomCard = styled(Card)`
  transition: box-shadow 0.3s, border-color 0.3s;
  margin: 5px;

  &:hover {
    border-color: transparent;
    box-shadow: 5px 8px 24px 5px rgba(121, 123, 129, 0.6);
  }
  .ant-card-meta-title {
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
`;

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
`;

const Product = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { profile, currentUser } = useSelector((state) => state.user);

  const { item } = props;

  useEffect(() => {
    if (currentUser) {
      dispatch(getProfile());
    }
  }, [currentUser, dispatch]);

  const getThumbnail = () => {
    if (!item) return null;
    const thumbnail = []
      .concat(item.images)
      .find((img) => img.type === "THUMBNAIL");
    return BASE_URL + "products/images/" + thumbnail.url;
  };

  const onClickAddItemToCart = () => {
    dispatch(
      addItemToCart({
        ...item,
        selectedVariant: item.variants[0],
      })
    );
  };

  const onConfirmDelete = () => {
    const id = profile.wishlist.find((i) => i.product.id === item.id).id;
    if (id) {
      dispatch(removeWishlistItem(id)).then(() => {
        dispatch(getProfile());
      });
    }
  };

  const onAddWishlist = () => {
    dispatch(addItem2Wishlist(item)).then((res) => {
      if (res) {
        dispatch(getProfile());
      }
    });
  };

  const onClickViewDetail = () => {
    history.push("/products/" + item.id);
  };

  const getItemPrice = () => {
    if (item.variants.length) {
      return item.variants[0]["price"];
    }
    return 0;
  };

  return (
    <CustomCard
      style={{ width: 250 }}
      bordered={true}
      cover={
        <img
          style={{ cursor: "pointer", height: 270 }}
          onClick={onClickViewDetail}
          alt="example"
          src={getThumbnail()}
        />
      }
    >
      <Meta title={item.name} />
      <Footer>
        <Tooltip title={"Add to Wishlist"}>
          {profile ? (
            <Icon>
              {profile.wishlist.find((i) => i.product.id === item.id) ? (
                <FavoriteIcon color="error" onClick={onConfirmDelete} />
              ) : (
                <FavoriteBorderOutlined onClick={onAddWishlist} />
              )}
            </Icon>
          ) : (
            <Icon>{<FavoriteBorderOutlined onClick={onAddWishlist} />}</Icon>
          )}
        </Tooltip>
        <Price>
          <div>${getItemPrice()}</div>
        </Price>
        <Tooltip title={"Add to Cart"}>
          <Icon>
            <ShoppingCartOutlined onClick={onClickAddItemToCart} />
          </Icon>
        </Tooltip>
      </Footer>
    </CustomCard>
  );
};

export default Product;
