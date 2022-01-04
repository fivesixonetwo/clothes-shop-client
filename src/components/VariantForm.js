import { Button, Divider, Form, Input, InputNumber, Modal, Select, Space, Upload, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addAttribute, addAttributeValue, getAllAttributes, updateAttribute, updateAttributeValue } from "../redux/apiCalls";
import { MinusCircleOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { addError } from "../redux/alertRedux";
import { BASE_URL } from "../helpers/axiosInstance";


const { Option } = Select;

const VariantForm = ({ visible, onCreate, onCancel, initialValue }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const [attribute, setAttribute] = useState({ attributes: [], attributeValues: {}, values: [] });
    const [attributeName, setAttributeName] = useState("");
    const [attributeValue, setAttributeValue] = useState("");
    const [selectedAttributeName, setSelectedAttributeName] = useState(0);
    const [deletedGalleries, setDeletedGalleries] = useState([]);

    //Edit attribute form
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editAttribute, setEditAttribute] = useState({});
    const [toggleAttribute, setToggleAttribute] = useState(true);

    useEffect(() => {
        if (visible) {
            refreshAttributes();
        }
    }, [visible]);

    const refreshAttributes = () => {
        dispatch(getAllAttributes()).then((r) => {
            setAttribute(r.data);
        });
    }

    const resetForm = () => {
        setDeletedGalleries([]);
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
            dispatch(addError({ message: "Image must less than 1MB", timestamp: new Date().getTime() }));
        }
        return lt1M ? false : Upload.LIST_IGNORE;
    }

    const getInitialImages = () => {
        if (!initialValue || !initialValue.images) return [];
        return initialValue.images.map(i => {
            return {
                existed: true,
                id: i.id,
                uid: i.id,
                url: BASE_URL + "products/images/" + i.url
            };
        });
    }

    const onRemoveGallery = (e) => {
        setDeletedGalleries(deletedGalleries.concat(e));
    }

    const getInitialValue = (field, defaultValue) => {
        if (selectedAttributeName) return defaultValue;

        if (field && field.key < initialValue["optionsIds"].length && initialValue && initialValue['optionsIds']) {
            return initialValue['optionsIds'][field.key].name;
        }
        return defaultValue;
    }

    //Edit attribute form
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        setIsModalVisible(false);
        if (toggleAttribute) {
            await dispatch(updateAttribute(editAttribute.id, editAttribute.name));
        }
        else {
            await dispatch(updateAttributeValue(editAttribute.id, editAttribute.value));
        }
        refreshAttributes();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleEditAttribute = (id, name) => {
        showModal();
        setEditAttribute({ id, name });
        setToggleAttribute(true);
    }

    const handleEditAttributeValue = (id, value) => {
        showModal();
        setEditAttribute({ id, value });
        setToggleAttribute(false);
    }

    const handleEdit = (e) => {
        if (toggleAttribute)
            setEditAttribute(prev => ({ ...prev, name: e.target.value }))
        else
            setEditAttribute(prev => ({ ...prev, value: e.target.value }))
    }

    return (
        <>
            <Modal
                destroyOnClose={false}
                visible={visible}
                title={initialValue ? "Update Variant" : "Add Variant"}
                okText={initialValue ? "Update" : "Add"}
                cancelText="Cancel"
                onCancel={onSelfCancel}
                width={850}
                onOk={() => {
                    form
                        .validateFields()
                        .then(values => {
                            form.resetFields();
                            values.deletedGalleries = deletedGalleries;
                            onCreate(values);
                        });
                }}
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 18 }}
                    form={form}
                    layout="horizontal"
                    name="form_in_modal"
                >
                    <Form.Item name={"id"} noStyle initialValue={initialValue ? initialValue.id : -1}>
                        <Input type="hidden" />
                    </Form.Item>
                    <Form.Item label={"Prices"}>
                        <Space>
                            <Form.Item
                                label="Cost"
                                name={"cost"}
                                initialValue={initialValue ? initialValue.cost : 0}
                                required
                                rules={[{ required: true, message: 'Please input cost!' }]}>
                                <InputNumber min={0} formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Price"
                                name={"price"}
                                required
                                initialValue={initialValue ? initialValue['price'] : 0}
                                rules={[{ required: true, message: 'Please input price!' }]}>
                                <InputNumber min={0} formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Stock Quantity"
                                name={"stock"}
                                initialValue={initialValue ? initialValue['stock'] : 1}
                                required
                                rules={[{ required: true, message: 'Please input stock!' }]}>
                                <InputNumber min={0} />
                            </Form.Item>
                        </Space>
                    </Form.Item>
                    <Form.Item label={"Options"}>
                        <Form.List name="options"
                            initialValue={initialValue ? initialValue['optionsIds'] : []}>
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(field => (
                                        <Space key={field.key} align="baseline">
                                            <Form.Item
                                                {...field}
                                                label="Name"
                                                name={[field.name, 'name']}
                                                fieldKey={[field.fieldKey, 'name']}
                                                rules={[{ required: true, message: 'Missing name' }]}
                                            >
                                                <Select onChange={onAttributeNameChange} style={{ width: 150 }}
                                                    dropdownRender={menu => (
                                                        <div>
                                                            {menu}
                                                            <Divider style={{ margin: '4px 0' }} />
                                                            <div style={{
                                                                display: 'flex',
                                                                flexWrap: 'nowrap',
                                                                padding: 8
                                                            }}>
                                                                <Input size={"small"}
                                                                    style={{ flex: 'auto', fontSize: 12 }}
                                                                    value={attributeName}
                                                                    placeholder={"name..."}
                                                                    onChange={(e) => setAttributeName(e.target.value)} />
                                                                <div onClick={onAddAttribute}
                                                                    style={{
                                                                        flex: 'none',
                                                                        padding: '4px',
                                                                        display: 'block',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    <PlusOutlined />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}>
                                                    {attribute.attributes.map(c => <Option key={c.id}
                                                        value={c.id}><Tooltip title={c.name}><EditOutlined className="edit-icon" onClick={() => handleEditAttribute(c.id, c.name)} />{c.name}</Tooltip></Option>)}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                label="Value"
                                                name={[field.name, 'value']}
                                                fieldKey={[field.fieldKey, 'value']}
                                                rules={[{ required: true, message: 'Missing value' }]}
                                            >
                                                <Select style={{ width: 300 }} dropdownRender={menu => (
                                                    <div>
                                                        {menu}
                                                        <Divider style={{ margin: '4px 0' }} />
                                                        <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                                            <Input size={"small"} style={{ flex: 'auto', fontSize: 12 }}
                                                                value={attributeValue}
                                                                onChange={(e) => setAttributeValue(e.target.value)} />
                                                            <div onClick={onAddAttributeValue}
                                                                style={{
                                                                    flex: 'none',
                                                                    padding: '4px',
                                                                    display: 'block',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                <PlusOutlined />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}>
                                                    {([].concat(attribute.attributeValues[initialValue && initialValue.id ? getInitialValue(field, selectedAttributeName) : selectedAttributeName] || [])).map(c =>
                                                        <Option key={c.id}
                                                            value={c.id}><Tooltip title={c.value}><EditOutlined className="edit-icon" onClick={() => handleEditAttributeValue(c.id, c.value)} />{c.value}</Tooltip></Option>)}
                                                </Select>
                                            </Form.Item>

                                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                                        </Space>
                                    ))}

                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add Option
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form.Item>
                    <Form.Item shouldUpdate={true}
                        initialValue={getInitialImages()}
                        label="Galleries"
                        name={"galleries"}>
                        <Upload
                            beforeUpload={onBeforeUpload}
                            accept={".png,.jpeg,.jpg"}
                            onPreview={onPreview}
                            defaultFileList={getInitialImages()}
                            onRemove={onRemoveGallery}
                            maxCount={6}
                            listType="picture-card"
                        >
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal title={toggleAttribute ? "Edit Attribute" : "Edit Attribute Value"} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Input onChange={handleEdit} value={editAttribute.value || editAttribute.name} />
            </Modal>
        </>
    );
}

export default VariantForm;