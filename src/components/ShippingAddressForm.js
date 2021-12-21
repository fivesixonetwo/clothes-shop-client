import {Checkbox, Form, Input, Modal} from "antd";
import {useEffect} from "react";

const addressModel = {
    id: null,
    name: "",
    city: "",
    district: "",
    ward: "",
    address: "",
    phoneNumber: "",
    default: false
}

const ShippingAddressForm = ({visible, onCreate, onCancel, initialValue = addressModel}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields()
    }, [initialValue]);

    const onSelfCancel = () => {
        form.resetFields();
        if (onCancel) {
            onCancel();
        }
    }

    return (
        <Modal
            destroyOnClose={true}
            visible={visible}
            title={initialValue.id ? "Edit shipping address" : "Add new shipping address"}
            okText={initialValue.id ? "Update" : "Add"}
            cancelText="Cancel"
            onCancel={onSelfCancel}
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
                labelCol={{span: 6}}
                wrapperCol={{span: 16}}
                form={form}
                layout="horizontal"
                name="form_in_modal"
            >
                <Form.Item name={"id"} noStyle initialValue={initialValue.id}>
                    <Input type="hidden"/>
                </Form.Item>
                <Form.Item
                    name="name"
                    shouldUpdate={true}
                    initialValue={initialValue.name}
                    label="Name"
                    rules={[{required: true, message: 'Please input Name'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="city"
                    label="City"
                    initialValue={initialValue.city}
                    rules={[{required: true, message: 'Please input City!'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="district"
                    label="District"
                    initialValue={initialValue.district}
                    rules={[{required: true, message: 'Please input District!'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="ward"
                    label="Ward"
                    initialValue={initialValue.ward}
                    rules={[{required: true, message: 'Please input Ward!'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="address"
                    label="Address"
                    initialValue={initialValue.address}
                    rules={[{required: true, message: 'Please input Address!'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="phoneNumber"
                    label="Phone Number"
                    initialValue={initialValue.phoneNumber}
                    rules={[{required: true, message: 'Please input Phone Number!'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item wrapperCol={{offset: 6}}
                           name="defaultAddress"
                           valuePropName="checked"
                           initialValue={initialValue.default}
                >
                    <Checkbox>
                        Set as default
                    </Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default ShippingAddressForm;