import styled from "styled-components";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {addShippingAddress, deleteShippingAddress, getShippingAddress, updateShippingAddress} from "../redux/apiCalls";
import {Button, List, Popconfirm, Typography} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import ShippingAddressForm from "./ShippingAddressForm";


const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const AddressItemContainer = styled(List.Item)`
  margin-top: 10px;
  display: flex;
  padding: 20px 20px;
  border-radius: 5px;
  background-color: var(--bgPrimary);
  box-shadow: 0px 0px 3px rgb(0 0 0 / 18%);
`

const AddressItem = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const AddressActions = styled.div`
  display: flex;
  flex-direction: column;
`

const Mark = styled.div`
  padding: 1.5px 5px;
  background-color: #00bfa5;
  color: white;
  font-size: 12px;
  margin-left: 5px;
  border-radius: 4px;
`;

const {Text} = Typography;

const ShippingAddress = () => {
    const dispatch = useDispatch();

    const [address, setAddress] = useState([]);
    const [visible, setVisible] = useState(false);
    const [initialValue, setInitialValue] = useState({});

    useEffect(() => {
        refreshShippingAddress();
    }, []);

    const refreshShippingAddress = () => {
        dispatch(getShippingAddress()).then((r) => {
            setAddress(r.data);
        });
    }

    const onCreate = (values) => {
        setVisible(false);
        if (initialValue && initialValue.id) {
            onUpdateShippingAddress(values);
            return;
        }
        dispatch(addShippingAddress(values)).then(() => {
            refreshShippingAddress();
        });
    }

    const onUpdateShippingAddress = (address, defaultAddress) => {
        if (defaultAddress) {
            address.defaultAddress = true;
        }
        dispatch(updateShippingAddress(address)).then(() => {
            refreshShippingAddress();
        });
    }

    const onClickEditAddress = (address) => {
        setInitialValue(address);
        setVisible(true);
    }

    const onConfirmDeleteAddress = (id) => {
        dispatch(deleteShippingAddress(id)).then(() => {
            refreshShippingAddress();
        });
    }

    const onClickAddNew = () => {
        setInitialValue({});
        setVisible(true);
    }

    return (
        <Container>
            <Button onClick={onClickAddNew} icon={<PlusOutlined/>} type="primary" block>
                Add new
            </Button>
            <List
                itemLayout="horizontal"
                dataSource={address}
                renderItem={item => (
                    <AddressItemContainer>
                        <AddressItem>
                            <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                <h4>{item.name}</h4>
                                {item.default && <Mark>Default</Mark>}
                            </div>
                            <span><Text
                                type="secondary">Address: </Text>{item.address} - {item.ward} - {item.district} - {item.city}</span>
                            <span><Text type="secondary">Phone number: </Text>{item.phoneNumber}</span>

                        </AddressItem>
                        <AddressActions>
                            <Button onClick={() => onClickEditAddress(item)} size={"small"} type="link">Edit</Button>
                            <Popconfirm
                                title="Are you sure to delete this address?"
                                okText="Yes"
                                onConfirm={() => onConfirmDeleteAddress(item.id)}
                                cancelText="No"
                            >
                                <Button size={"small"} type="link" danger>
                                    Delete
                                </Button>
                            </Popconfirm>
                            <Button onClick={() => onUpdateShippingAddress(item, true)} disabled={item.default}
                                    type="primary" size={"small"}>Set as default</Button>
                        </AddressActions>
                    </AddressItemContainer>
                )}
            />,
            <ShippingAddressForm
                visible={visible}
                initialValue={initialValue}
                onCreate={onCreate}
                onCancel={() => {
                    setVisible(false);
                }}
            />
        </Container>
    );
};

export default ShippingAddress;
