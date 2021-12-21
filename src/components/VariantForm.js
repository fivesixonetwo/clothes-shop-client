import {Button, Divider, Form, Input, InputNumber, Modal, Select, Space, Upload} from "antd";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {addAttribute, addAttributeValue, getAllAttributes} from "../redux/apiCalls";
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {addError} from "../redux/alertRedux";

const productModel = {
    id: null,
    parentId: null,
    name: "",
    imageUrl: "",
    enabled: false,
};

const {Option} = Select;

const VariantForm = ({visible, onCreate, onCancel, initialValue = productModel}) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const [attribute, setAttribute] = useState({attributes: [], attributeValues: {}, values: []});
    const [attributeName, setAttributeName] = useState("");
    const [attributeValue, setAttributeValue] = useState("");
    const [selectedAttributeName, setSelectedAttributeName] = useState(0);

    useEffect(() => {
        refreshAttributes();
    }, []);

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

    return (
        <Modal
            destroyOnClose={false}
            visible={visible}
            title={initialValue.id ? "Update Variant" : "Add Variant"}
            okText={initialValue.id ? "Update" : "Add"}
            cancelText="Cancel"
            onCancel={onSelfCancel}
            width={850}
            onOk={() => {
                form
                    .validateFields()
                    .then(values => {
                        form.resetFields();
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
                <Form.Item
                    name="name"
                    shouldUpdate={true}
                    initialValue={initialValue.name}
                    label="Name"
                    rules={[{required: false}]}
                >
                    <Input placeholder={"Variant name"}/>
                </Form.Item>
                <Form.Item label={"Prices"}>
                    <Space>
                        <Form.Item
                            label="Cost"
                            name={"cost"}
                            required
                            rules={[{required: true, message: 'Please input cost!'}]}>
                            <InputNumber formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                         parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Price"
                            name={"price"}
                            required
                            rules={[{required: true, message: 'Please input price!'}]}>
                            <InputNumber formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                         parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Stock Quantity"
                            name={"stock"}
                            required
                            rules={[{required: true, message: 'Please input stock!'}]}>
                            <InputNumber min={1}/>
                        </Form.Item>
                    </Space>
                </Form.Item>
                <Form.Item label={"Options"}>
                    <Form.List name="options">
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map(field => (
                                    <Space key={field.key} align="baseline">
                                        <Form.Item
                                            {...field}
                                            label="Name"
                                            name={[field.name, 'name']}
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
                                            name={[field.name, 'value']}
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
                                                {([].concat(attribute.attributeValues[selectedAttributeName] || [])).map(c =>
                                                    <Option key={c.id}
                                                            value={c.id}>{c.value}</Option>)}
                                            </Select>
                                        </Form.Item>

                                        <MinusCircleOutlined onClick={() => remove(field.name)}/>
                                    </Space>
                                ))}

                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                        Add Option
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form.Item>
                <Form.Item shouldUpdate={true} label="Galleries" name={"galleries"}>
                    <Upload
                        beforeUpload={onBeforeUpload}
                        accept={".png,.jpeg,.jpg"}
                        onPreview={onPreview}
                        maxCount={6}
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

export default VariantForm;