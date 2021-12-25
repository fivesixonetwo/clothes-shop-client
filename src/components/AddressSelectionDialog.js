import {Modal, Radio, Space, Typography} from "antd";
import {useState} from "react";
import styled from "styled-components";

const Mark = styled.div`
  padding: 1.5px 5px;
  background-color: #00bfa5;
  color: white;
  font-size: 12px;
  margin-left: 10px;
  border-radius: 4px;
`;

const {Text} = Typography;

const AddressSelectionDialog = ({visible, onOk, onCancel, address, selected}) => {
    const [value, setValue] = useState((selected && selected.id) || 0);

    const onChange = e => {
        setValue(e.target.value);
    };

    const beforeCancel = () => {
        setValue(0);
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
            title={"Select Shipping Address"}
            okText={"Select"}
            cancelText="Cancel"
            width={600}
            onCancel={beforeCancel}
            onOk={onDone}
        >
            <Radio.Group onChange={onChange} defaultValue={(selected && selected.id) || 0}>
                <Space direction={"vertical"} size={"large"}>
                    {address.map((item) => {
                        return (
                            <Radio value={item.id} key={item.id} checked={true}>
                                <div style={{display: "flex", flexDirection: "column"}}>
                                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                        <h4>{item.name}</h4>
                                        {item.default && <Mark>Default</Mark>}
                                    </div>
                                    <span><Text
                                        type="secondary"
                                        style={{marginRight: 5}}>Address: </Text>{item.address} - {item.ward} - {item.district} - {item.city}</span>
                                    <span><Text style={{marginRight: 5}}
                                                type="secondary">Phone number: </Text>{item.phoneNumber}</span>
                                </div>
                            </Radio>
                        )
                    })}
                </Space>
            </Radio.Group>
        </Modal>
    );
}

export default AddressSelectionDialog;