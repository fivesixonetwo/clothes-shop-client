import {Checkbox, Form, Input, Modal} from "antd";
import {useEffect} from "react";

const categoryModel = {
    id: null,
    parentId: null,
    name: "",
    imageUrl: "",
    enabled: false,
}

const CategoryForm = ({visible, onCreate, onCancel, initialValue = categoryModel}) => {
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
            title={initialValue.id ? "Edit Category" : "Add Category"}
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
                initialValues={{enabled: true}}
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
                <Form.Item wrapperCol={{offset: 6}}
                           name="enabled"
                           valuePropName="checked"
                           initialValue={initialValue ? initialValue.enabled : true}
                >
                    <Checkbox>
                        Enable?
                    </Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default CategoryForm;