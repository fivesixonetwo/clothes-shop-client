import {Button, Divider, Form, Input, Modal, Select, Space, Upload} from "antd";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {addAttribute, addAttributeValue, getAllAttributes, getCategories} from "../redux/apiCalls";
import TextArea from "antd/lib/input/TextArea";
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {addError} from "../redux/alertRedux";
import {BASE_URL} from "../helpers/axiosInstance";


const {Option} = Select;

const ProductForm = ({visible, onCreate, onCancel, initialValue}) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const [categories, setCategories] = useState([]);
    const [attribute, setAttribute] = useState({attributes: [], attributeValues: {}, values: []});
    const [attributeName, setAttributeName] = useState("");
    const [attributeValue, setAttributeValue] = useState("");
    const [selectedAttributeName, setSelectedAttributeName] = useState(0);
    const [removedGalleries, setRemovedGalleries] = useState([]);

    useEffect(() => {
        if (visible) {
            dispatch(getCategories()).then((r) => {
                setCategories(r.data);
            });
            refreshAttributes();
        }
    }, [visible]);

    const refreshAttributes = () => {
        dispatch(getAllAttributes()).then((r) => {
            setAttribute(r.data);
        });
    }

    const resetForm = () => {
        form.resetFields();
        setAttributeName("");
        setAttributeValue("");
        setSelectedAttributeName(0);
    }

    useEffect(() => {
        resetForm();
    }, [initialValue]);

    const onSelfCancel = () => {
        resetForm();
        if (onCancel) {
            onCancel();
        }
    }

    const onAddAttribute = () => {
        if (!attributeName) return;
        dispatch(addAttribute(attributeName)).then(() => refreshAttributes());
        setAttributeName("");
    }

    const onAttributeNameChange = (value) => {
        setSelectedAttributeName(value);
    }

    const onAddAttributeValue = () => {
        if (!selectedAttributeName || !attributeValue) return;
        dispatch(addAttributeValue(selectedAttributeName, attributeValue)).then(() => {
            setAttributeValue("");
            refreshAttributes();
        });
    }

    const onPreview = async file => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    };

    const onBeforeUpload = (file) => {
        const lt1M = file.size / 1024 / 1024 < 1;
        if (!lt1M) {
            dispatch(addError({message: "Image must less than 1MB", timestamp: new Date().getTime()}));
        }
        return lt1M ? false : Upload.LIST_IGNORE;
    }

    const getInitialImages = (type) => {
        if (initialValue) {
            const images = [].concat(initialValue.images).filter(img => img.type === type);
            if (type === "THUMBNAIL" && images) {
                return [
                    {
                        id: images[0].id,
                        url: BASE_URL + "products/images/" + images[0].url
                    }
                ]
            } else if (images) {
                return images.map(i => {
                    return {
                        existed: true,
                        id: i.id,
                        uid: i.id,
                        url: BASE_URL + "products/images/" + i.url
                    };
                });
            }
        }
        return [];
    }

    const getInitialValue = (field, defaultValue) => {
        if (selectedAttributeName) return defaultValue;
        if (field && field.key < initialValue["specificationIds"].length && initialValue && initialValue['specificationIds']) {
            return initialValue['specificationIds'][field.key].name;
        }
        return defaultValue;
    }

    const onRemoveGallery = (e) => {
        setRemovedGalleries(removedGalleries.concat(e));
    }

    return (
        <Modal
            destroyOnClose={true}
            visible={visible}
            title={initialValue ? "Update Product" : "Add Product"}
            okText={initialValue ? "Update" : "Add"}
            cancelText="Cancel"
            onCancel={onSelfCancel}
            width={850}
            onOk={() => {
                form
                    .validateFields()
                    .then(values => {
                        form.resetFields();
                        values.removedGalleries = removedGalleries;
                        onCreate(values);
                    });
            }}
        >
            <Form
                labelCol={{span: 4}}
                wrapperCol={{span: 18}}
                form={form}
                layout="horizontal"
                name="form_in_modal"
            >
                <Form.Item name={"id"} noStyle initialValue={initialValue ? initialValue.id : -1}>
                    <Input type="hidden"/>
                </Form.Item>
                <Form.Item
                    name="name"
                    shouldUpdate={true}
                    initialValue={initialValue ? initialValue.name : ""}
                    label="Name"
                    rules={[{required: true, message: 'Please input name'}]}
                >
                    <Input placeholder={"Name"}/>
                </Form.Item>
                <Form.Item hasFeedback
                           label="Category"
                           name={"category"}
                           required
                           initialValue={initialValue ? initialValue.category.id : null}
                           rules={[{required: true, message: 'Please select category!'}]}>
                    <Select placeholder={"Category"}>
                        {categories.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="description"
                    shouldUpdate={true}
                    initialValue={initialValue ? initialValue.description : ""}
                    label="Description"
                >
                    <TextArea placeholder={"description"}/>
                </Form.Item>
                <Form.Item label={"Specifications"}>
                    <Form.List name="specifications"
                               initialValue={initialValue ? initialValue['specificationIds'] : []}>
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map((field, name) => (
                                    <Space key={field.key} align="baseline">
                                        <Form.Item
                                            {...field}
                                            label="Name"
                                            name={[name, 'name']}
                                            fieldKey={[field.fieldKey, 'name']}
                                            rules={[{required: true, message: 'Missing name'}]}
                                        >
                                            <Select onChange={onAttributeNameChange} style={{width: 150}}
                                                    dropdownRender={menu => (
                                                        <div>
                                                            {menu}
                                                            <Divider style={{margin: '4px 0'}}/>
                                                            <div style={{
                                                                display: 'flex',
                                                                flexWrap: 'nowrap',
                                                                padding: 8
                                                            }}>
                                                                <Input size={"small"}
                                                                       style={{flex: 'auto', fontSize: 12}}
                                                                       value={attributeName}
                                                                       placeholder={"name..."}
                                                                       onChange={(e) => setAttributeName(e.target.value)}/>
                                                                <a onClick={onAddAttribute}
                                                                   style={{
                                                                       flex: 'none',
                                                                       padding: '4px',
                                                                       display: 'block',
                                                                       cursor: 'pointer'
                                                                   }}
                                                                >
                                                                    <PlusOutlined/>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}>
                                                {attribute.attributes.map(c => <Option key={c.id}
                                                                                       value={c.id}>{c.name}</Option>)}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...field}
                                            label="Value"
                                            name={[name, 'value']}
                                            fieldKey={[field.fieldKey, 'value']}
                                            rules={[{required: true, message: 'Missing value'}]}
                                        >
                                            <Select style={{width: 300}} dropdownRender={menu => (
                                                <div>
                                                    {menu}
                                                    <Divider style={{margin: '4px 0'}}/>
                                                    <div style={{display: 'flex', flexWrap: 'nowrap', padding: 8}}>
                                                        <Input size={"small"} style={{flex: 'auto', fontSize: 12}}
                                                               value={attributeValue}
                                                               onChange={(e) => setAttributeValue(e.target.value)}/>
                                                        <a onClick={onAddAttributeValue}
                                                           style={{
                                                               flex: 'none',
                                                               padding: '4px',
                                                               display: 'block',
                                                               cursor: 'pointer'
                                                           }}
                                                        >
                                                            <PlusOutlined/>
                                                        </a>
                                                    </div>
                                                </div>
                                            )}>
                                                {([].concat(attribute.attributeValues[initialValue && initialValue.id ? getInitialValue(field, selectedAttributeName) : selectedAttributeName] || [])).map(c =>
                                                    <Option key={c.id}
                                                            value={c.id}>{c.value}</Option>)}
                                            </Select>
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(field.name)}/>
                                    </Space>
                                ))}

                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                        Add Specification
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form.Item>

                <Form.Item rules={[{required: !initialValue, message: 'Please select a thumbnail!'}]}
                           shouldUpdate={true}
                           label="Thumbnail"
                           name={"thumbnail"}>
                    <Upload
                        beforeUpload={onBeforeUpload}
                        accept={".png,.jpeg,.jpg"}
                        onPreview={onPreview}
                        defaultFileList={getInitialImages("THUMBNAIL")}
                        maxCount={1}
                        listType="picture-card"
                    >
                        <div>
                            <PlusOutlined/>
                            <div style={{marginTop: 8}}>Upload</div>
                        </div>
                    </Upload>
                </Form.Item>
                <Form.Item shouldUpdate={true}
                           initialValue={getInitialImages("GALLERY")}
                           label="Galleries"
                           name={"galleries"}>
                    <Upload
                        beforeUpload={onBeforeUpload}
                        accept={".png,.jpeg,.jpg"}
                        onPreview={onPreview}
                        defaultFileList={getInitialImages("GALLERY")}
                        maxCount={6}
                        onRemove={onRemoveGallery}
                        listType="picture-card"
                    >
                        <div>
                            <PlusOutlined/>
                            <div style={{marginTop: 8}}>Upload</div>
                        </div>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default ProductForm;