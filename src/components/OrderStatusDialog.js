import {Modal, Select} from "antd";
import {useState} from "react";

const {Option} = Select;

const OrderStatusDialog = ({visible, onOk, onCancel}) => {

    const [value, setValue] = useState("Pending");

    const onChange = e => {
        setValue(e);
    };

    const beforeCancel = () => {
        onCancel();
    }

    const onDone = () => {
        onOk(value);
    }

    return (
        <Modal
            destroyOnClose={true}
            visible={visible}
            centered
            title={"Change Order Status"}
            okText={"Select"}
            cancelText="Cancel"
            width={400}
            onCancel={beforeCancel}
            onOk={onDone}
        >
            <label htmlFor={"Status"}>Status:</label>
            <Select id={"Status"} defaultValue="Pending" style={{width: 350, marginBottom: 50, marginTop: 5}} onChange={onChange}>
                <Option value="Pending">Pending</Option>
                <Option value="Confirmed">Confirmed</Option>
                <Option value="Shipping">Shipping</Option>
                <Option value="Shipped">Shipped</Option>
                <Option value="Completed">Completed</Option>
                <Option value="Declined">Declined</Option>
            </Select>
        </Modal>
    );
}

export default OrderStatusDialog;