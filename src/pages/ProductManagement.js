import styled from "styled-components";
import {Badge, Button, Image, List, Popconfirm, Space, Table, Tooltip} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import ProductForm from "../components/ProductForm";
import {useDispatch} from "react-redux";
import {
    addProduct,
    addProductVariant,
    deleteProduct,
    deleteProductVariant,
    getProducts,
    publishProduct
} from "../redux/apiCalls";
import {BASE_URL} from "../helpers/axiosInstance";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PublishIcon from '@mui/icons-material/Publish';
import {getReadableSpecifications, groupBy} from "../helpers/utils";
import AddBoxIcon from '@mui/icons-material/AddBox';
import VariantForm from "../components/VariantForm";
import CurrencyFormat from "react-currency-format";


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

const ProductManagement = () => {

    const dispatch = useDispatch();

    const [products, setProducts] = useState([]);
    const [productFormVisible, setProductFormVisible] = useState(false);
    const [productVariantFormVisible, setProductVariantFormVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState({});

    useEffect(() => {
        refreshProducts();
    }, []);

    const refreshProducts = () => {
        dispatch(getProducts()).then((r) => {
            setProducts(r.data);
        });
    }

    const onDeleteProduct = (product) => {
        dispatch(deleteProduct(product.id)).then(() => {
            refreshProducts();
        });
    }

    const onPublishProduct = (product) => {
        dispatch(publishProduct(product.id)).then(() => {
            refreshProducts();
        });
    }

    const generalProductColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 50,
        },
        {
            title: 'Thumbnail',
            dataIndex: 'images',
            key: 'Thumbnail',
            width: 150,
            render: (images) => {
                const thumbnail = [].concat(images).find(img => img.type === "THUMBNAIL");
                return (
                    <Image
                        fallback="data:image/png;base64,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"
                        width={48}
                        height={48}
                        style={{objectFit: "contain"}}
                        src={BASE_URL + "products/images/" + thumbnail.url}/>
                )
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Category',
            dataIndex: ["category", "name"],
            width: 150,
            key: 'category'
        },
        {
            title: 'Status',
            dataIndex: 'published',
            width: 150,
            key: 'published',
            render: (published, record) => (
                <span>
                    <Badge status={published ? "success" : "error"}/>
                    {record.deleted ? "Deleted" : published ? "Published" : "Unpublished"}
                </span>
            ),
        },
        {
            title: 'Variants',
            width: 120,
            align: "right",
            dataIndex: "variants",
            key: 'variants',
            render: (variants, record) => (
                <span>
                    {variants.length}
                </span>
            ),
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
                <Space size="small">
                    <Tooltip title="Edit" overlayInnerStyle={{fontSize: 12}}>
                        <Button disabled={record.deleted} type="text" shape={"default"}
                                icon={<EditIcon fontSize={"small"}/>}/>
                    </Tooltip>
                    <Popconfirm disabled={record.deleted}
                                title="Are you sure to delete this product?"
                                okText="Yes"
                                onConfirm={() => onDeleteProduct(record)}
                                cancelText="No"
                    >
                        <Button disabled={record.deleted} type="text" shape={"default"}
                                icon={<DeleteIcon sx={{color: "red"}} fontSize={"small"}/>}/>
                    </Popconfirm>
                    <Tooltip title="Publish" overlayInnerStyle={{fontSize: 12}}>
                        <Button onClick={() => onPublishProduct(record)} disabled={record.deleted} type="text"
                                shape={"default"}
                                icon={<PublishIcon color={"primary"} fontSize={"small"}/>}/>
                    </Tooltip>
                    <Tooltip title="Add Variant" overlayInnerStyle={{fontSize: 12}}>
                        <Button onClick={() => onPrepareAddVariant(record)} disabled={record.deleted} type="text"
                                shape={"default"}
                                icon={<AddBoxIcon color={"primary"} fontSize={"small"}/>}/>
                    </Tooltip>
                </Space>
            ),
        }
    ]

    const onSubmitProductForm = (values) => {
        setProductFormVisible(false);
        dispatch(addProduct(values)).then(() => {
            refreshProducts();
        });
    }

    const onCreateVariant = (values) => {
        setProductVariantFormVisible(false);
        values.productId = selectedProduct.id;
        dispatch(addProductVariant(values)).then(() => refreshProducts());
    }

    const onPrepareAddVariant = (record) => {
        setSelectedProduct(record);
        setProductVariantFormVisible(true);
    }

    const onDeleteVariant = (record) => {
        dispatch(deleteProductVariant(record.id)).then(() => refreshProducts());
    }

    const variantColumns = [
        {title: 'Name', dataIndex: 'variantName', key: 'variantName'},
        {title: 'Stock', dataIndex: 'stock', key: 'stock', width: 100},
        {
            title: 'Cost',
            dataIndex: 'cost',
            width: 150,
            key: 'cost',
            align: "right",
            render: (value) => <CurrencyFormat decimalScale={0} prefix={"$"} value={value} displayType={'text'}
                                               thousandSeparator={true}/>
        },
        {
            title: 'Price',
            align: "right",
            width: 150,
            dataIndex: 'price',
            key: 'price',
            render: (value) => <CurrencyFormat decimalScale={0} prefix={"$"} value={value} displayType={'text'}
                                               thousandSeparator={true}/>
        },
        {
            title: 'Action',
            dataIndex: 'operation',
            width: 150,
            key: 'operation',
            render: (value, record) => (
                <Space size="small">
                    <Button type="text" shape={"default"} size={"small"}
                            icon={<EditIcon fontSize={"small"}/>}/>
                    <Popconfirm title="Are you sure to delete this variant?"
                                okText="Yes"
                                onConfirm={() => onDeleteVariant(record)}
                                cancelText="No"
                    ><Button type="text" danger shape={"default"} size={"small"}
                             icon={<DeleteIcon fontSize={"small"}/>}/></Popconfirm>
                </Space>
            ),
        },
    ]

    const nestedRowRenderer = (record) => {
        const readableSpec = getReadableSpecifications(record['specifications']);
        return (
            <Space style={{display: "flex", flex: 1}} direction={"vertical"} size={"middle"}>
                <div>
                    <span>Descriptions: {record.description}</span>
                </div>
                <div>
                    <List
                        style={{flex: 1}}
                        size="small"
                        header={<b>Specifications</b>}
                        dataSource={readableSpec}
                        locale={{emptyText: "No specifications"}}
                        renderItem={item => <List.Item>
                            <span>{item.key}: {item.values}</span>
                        </List.Item>}
                    />
                </div>
                <h4>Variants:</h4>
                <Table locale={{emptyText: "No variants"}} size={"small"} columns={variantColumns} pagination={false} dataSource={record.variants}/>
            </Space>
        )
    }


    return (
        <Container>
            <Actions>
                <Button onClick={() => setProductFormVisible(true)} type="primary" icon={<PlusOutlined/>}>
                    Add New
                </Button>
            </Actions>
            <Table style={{flex: 1}}
                   rowKey={"id"}
                   dataSource={products}
                   expandable={{expandedRowRender: nestedRowRenderer}}
                   columns={generalProductColumns}/>
            <ProductForm visible={productFormVisible}
                         onCreate={onSubmitProductForm}
                         onCancel={() => setProductFormVisible(false)}/>
            <VariantForm visible={productVariantFormVisible}
                         onCreate={onCreateVariant}
                         onCancel={() => setProductVariantFormVisible(false)}/>
        </Container>
    );
};

export default ProductManagement;
