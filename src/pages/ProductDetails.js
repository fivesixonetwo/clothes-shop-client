import styled from "styled-components";
import { useEffect, useState, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItem2Wishlist, addItemToCart, getProductDetail, getProfile, removeWishlistItem } from "../redux/apiCalls";
import { Button, Divider, InputNumber, Select, Typography, Tooltip } from "antd";
import { BASE_URL } from "../helpers/axiosInstance";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { FavoriteBorderOutlined } from "@material-ui/icons";
import { getReadableSpecifications } from "../helpers/utils";
import SimpleImageSlider from "react-simple-image-slider";
import { useSnackbar } from "notistack";
import FavoriteIcon from '@mui/icons-material/Favorite';

import { getProductsRecommend } from "../redux/apiCalls";
import Product from "../components/Product";

const { Text } = Typography;
const { Option } = Select;

const ProductContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  margin-bottom: 2px;
  margin-top: 0.5px;
  background-color: var(--bgSecondary);
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 0 12%;
  padding: 20px;

  & > * {
    padding: 15px;
    margin-top: 10px;
    background-color: white;
    border-radius: 3px;
    box-shadow: 0 1px 1px 0 rgb(0 0 0 / 5%);
  }
`

const ProductWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const ProductImages = styled.div`
  width: 450px;

  & .ImgContainer {
    width: 100%;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding-left: 40px;
`;

const QuantityInput = styled.div`
  margin-top: 30px;

  & > div {
    margin-top: 20px;
    display: flex;
    align-items: center;

    & > * {
      margin-right: 10px;
    }
  }
`;

const SpecRow = styled.div`
  display: flex;
  flex-direction: row;

  &:not(:first-child) {
    margin-top: 5px;
  }
`

const TierWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;

  & > div {
    width: 80px;
  }

  &:not(:first-child) {
    margin-top: 15px;
  }
`

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const [recommend, setRecommend] = useState([]);

    const [product, setProduct] = useState({});
    const [images, setImages] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState({});

    const { profile, currentUser } = useSelector((state) => state.user);

    const history = useHistory();

    useEffect(() => {
        dispatch(getProductsRecommend(id)).then((res) => {
            setRecommend((res && res.data) || []);
        });
    }, [dispatch, id]);

    useEffect(() => {
        setImages([]);
        dispatch(getProductDetail(id)).then((res) => {
            if (res) {
                setProduct(res.data);
            }
        });
    }, [id, dispatch]);

    useEffect(() => {
        if (product.variants) {
            setSelectedVariant(product.variants[0]);
        }
    }, [product]);

    const getAllProductImages = useCallback(() => {
        let result = [];
        const baseUrl = BASE_URL + "products/images/";
        if (product.images && product.images.length) {
            product.images.forEach((item) => {
                result.push({ url: baseUrl + item.url });
            });
        }
        return result;
    }, [product.images])

    useEffect(() => {
        const baseUrl = BASE_URL + "products/images/";
        if (selectedVariant && selectedVariant.images) {
            const result = selectedVariant.images.map((it) => {
                return { url: baseUrl + it.url };
            });
            setImages(result.concat(getAllProductImages()));
        }
    }, [selectedVariant, getAllProductImages]);

    useEffect(() => {
        if (product.images) {
            setImages(getAllProductImages());
        }
    }, [product.images, getAllProductImages]);



    useEffect(() => {
        if (currentUser) {
            dispatch(getProfile());
        }
    }, [dispatch, currentUser]);

    const onConfirmDelete = () => {
        const deleteId = profile.wishlist.find(i => i.product.id === +id)
        if (deleteId) {
            dispatch(removeWishlistItem(deleteId.id)).then(() => {
                dispatch(getProfile());
            });
        }
    }

    const onQuantityChange = (v) => {
        setQuantity(v);
    }

    const onClickAdd2Cart = () => {
        if (quantity > selectedVariant['stock']) {
            enqueueSnackbar("Max quantity must less than " + selectedVariant['stock'], { variant: "error" });
            return;
        }
        if (product.variants) {
            const p = {
                ...product,
                selectedVariant,
                quantity
            }
            dispatch(addItemToCart(p));
        }
    }

    const onClickAdd2Favorite = () => {
        dispatch(addItem2Wishlist(product)).then((res) => {
            if (res) {
                dispatch(getProfile());
            }
        });
    }

    const onClickBuyNow = () => {
        if (quantity > selectedVariant['stock']) {
            enqueueSnackbar("Max quantity must less than " + selectedVariant['stock'], { variant: "error" });
            return;
        }
        if (product.variants) {
            const p = {
                ...product,
                selectedVariant,
                quantity
            }
            // product.selectedVariant = selectedVariant;
            // product.quantity = quantity;
            dispatch(addItemToCart(p)).then(() => {
                history.push("/cart");
            });
        }
    }

    const onVariantChange = (value) => {
        const variant = product.variants.find(e => e.id === value);
        if (variant) {
            setSelectedVariant(variant);
        }
    }

    return (
        <Container>
            <Content>
                <ProductWrapper>
                    <ProductImages>
                        {images.length > 0 && <SimpleImageSlider
                            width={450}
                            height={450}
                            images={images}
                            startIndex={0}
                            showBullets={true}
                            showNavs={true} />}
                    </ProductImages>
                    <ProductInfo>
                        <h2>{product.name}</h2>
                        <Text style={{ color: "#ee4d2d", fontSize: 18 }} strong>${selectedVariant.price}</Text>
                        {
                            product?.variants?.filter(variant => variant['variantString'] !== '').length > 0 &&
                            <TierWrapper>
                                <div><Text type="secondary">Variant</Text></div>
                                <Select onChange={onVariantChange} value={selectedVariant.id || -1}
                                    style={{ minWidth: 250, marginLeft: 20 }}>
                                    {[].concat(product.variants || []).map((option) => {
                                        return (<Option key={option.id} value={option.id}>
                                            {option['variantString']}
                                        </Option>)
                                    })}
                                </Select>
                            </TierWrapper>

                        }

                        <QuantityInput>
                            <div><Text type="secondary" style={{ width: 80 }}>Quantity</Text> <Text
                                type="danger" style={{ marginLeft: 10 }}>{selectedVariant.stock} items available</Text></div>
                            <div>
                                <InputNumber onChange={onQuantityChange} min={1} max={selectedVariant['stock']}
                                    defaultValue={quantity} />
                                <Button disabled={selectedVariant['stock'] === 0} onClick={onClickAdd2Cart} size={"middle"}
                                    type="primary"
                                    icon={<ShoppingCartOutlined />}>
                                    Add to Cart
                                </Button>
                                <Button disabled={selectedVariant['stock'] === 0} onClick={onClickBuyNow} type="primary"
                                    danger>Buy Now</Button>
                                <Tooltip title={"Add to Wishlist"}>
                                    {
                                        profile
                                            ?
                                            <>
                                                {
                                                    profile.wishlist.find(i => i.product.id === +id)
                                                        ? <FavoriteIcon cursor="pointer" sytle={{ cursor: 'pointer' }} color='error' onClick={onConfirmDelete} />
                                                        : <FavoriteBorderOutlined cursor="pointer" sytle={{ cursor: 'pointer' }} onClick={onClickAdd2Favorite} />
                                                }
                                            </>
                                            :
                                            <FavoriteBorderOutlined cursor="pointer" onClick={onClickAdd2Favorite} />
                                    }
                                </Tooltip>
                            </div>
                        </QuantityInput>
                    </ProductInfo>
                </ProductWrapper>
                <div>
                    <h3>Product Specifications:</h3>
                    <Divider style={{ margin: 10 }} plain dashed={true} />
                    {getReadableSpecifications(product['specifications'] || []).map((value, index) => <SpecRow
                        key={index}>
                        <div style={{ width: 130 }}>
                            <Text type="secondary">{value.key}</Text>
                        </div>
                        <div>
                            {value.values}
                        </div>
                    </SpecRow>)}
                </div>
                <div>
                    <h3>Product Description:</h3>
                    <Divider style={{ margin: 10 }} plain dashed={true} />
                    <p>{product.description}</p>
                </div>
                {
                    recommend.length > 0 &&
                    <div>
                        <h3>Product Recommend</h3>
                        <Divider style={{ margin: 10 }} plain dashed={true} />
                        <ProductContainer>
                            {recommend.map((item) => <Product item={item} key={item.id} />)}
                        </ProductContainer>
                    </div>
                }
            </Content>
        </Container>);
};

export default ProductDetails;
