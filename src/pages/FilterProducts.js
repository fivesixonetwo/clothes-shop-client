import styled from "styled-components";
import {Button, Checkbox, Divider, Typography} from "antd";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {filterProduct, getCategories} from "../redux/apiCalls";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Product from "../components/Product";
import {useLocation} from "react-router-dom";

const {Text} = Typography;
const Container = styled.div`
  display: flex;
  flex: 1;
  margin-bottom: 2px;
  margin-top: 1px;
  background-color: var(--bgSecondary);
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  margin: 0 12%;
  padding: 30px 20px;
`

const FilterContainer = styled.div`
  padding: 0 20px;
  width: 250px;
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > .Header {
    display: flex;

    & > h4 {
      margin-left: 5px;
    }
  }
`;

const SortHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > span {
    color: gray;
    margin-left: 5px;
  }

  & > .SortContainer {
    & > span {
      margin-right: 8px;
    }
  }
`


const ProductListContainer = styled.div`
  padding-left: 20px;
  flex: 1;
`

const ProductsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;

  & > .ant-card {
    margin-top: 20px;
  }
`

const CustomDivider = styled(Divider)`
  margin: 15px 0;
`

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const FilterProducts = () => {

    let query = useQuery();
    const dispatch = useDispatch();

    const [categories, setCategories] = useState([]);
    const [productPageable, setProductPageable] = useState({content: []});
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        dispatch(getCategories()).then((r) => {
            if (r) {
                setCategories(r.data);
            }
        });
    }, []);

    useEffect(() => {
        setSelectedCategories([]);
        if (categories.length && query.get("category")) {
            setSelectedCategories([].concat(parseInt(query.get("category"))));
            const categories = [].concat(parseInt(query.get("category"))).join(",");
            dispatch(filterProduct(categories)).then((r) => {
                if (r) {
                    setProductPageable(r.data);
                }
            });
        }
    }, [categories.length, query.get("category")]);

    const onCategoriesChange = (v) => {
        setSelectedCategories(v);
    }

    const doFilterProduct = () => {
        const categories = selectedCategories.join(",");
        dispatch(filterProduct(categories)).then((r) => {
            if (r) {
                setProductPageable(r.data);
            }
        });
    }

    const onClearFilter = () => {
        setSelectedCategories([]);
        dispatch(filterProduct([])).then((r) => {
            if (r) {
                setProductPageable(r.data);
            }
        });
    }

    const onApplyFilter = () => {
        doFilterProduct();
    }

    return (<Container>
        <Content>
            <FilterContainer>
                <FilterHeader>
                    <div className={"Header"}>
                        <FilterAltIcon fontSize={"small"}/>
                        <h4>FILTER PRODUCT</h4>
                    </div>
                    <Button onClick={onClearFilter} type="link" size={"small"}>
                        Clear
                    </Button>
                </FilterHeader>
                <CustomDivider/>
                <Text strong>By Category</Text>
                <Checkbox.Group value={selectedCategories} onChange={onCategoriesChange}
                                style={{display: "flex", flexDirection: "column", marginTop: 15}}>
                    {categories.map((cate) => {
                        return (<Checkbox key={cate.id} value={cate.id}>{cate.name}</Checkbox>)
                    })}
                </Checkbox.Group>
                <CustomDivider/>
                {/*<Text strong>Price Range</Text>*/}
                {/*<Input.Group size={"default"} style={{display: "flex", flexDirection: "row", marginTop: 15}}>*/}
                {/*    <InputNumber min={0} formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}*/}
                {/*                 parser={value => value.replace(/\$\s?|(,*)/g, '')}*/}
                {/*                 style={{flex: 1, textAlign: 'center'}}*/}
                {/*                 controls={false}*/}
                {/*                 placeholder="1"/>*/}
                {/*    <Text style={{width: 30, display: "flex", justifyContent: "center", alignItems: "center"}}*/}
                {/*          strong> - </Text>*/}
                {/*    <InputNumber*/}
                {/*        placeholder={"$2"}*/}
                {/*        min={0}*/}
                {/*        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}*/}
                {/*        parser={value => value.replace(/\$\s?|(,*)/g, '')}*/}
                {/*        style={{*/}
                {/*            flex: 1, textAlign: 'center',*/}
                {/*        }}*/}
                {/*        controls={false}*/}
                {/*    />*/}
                {/*</Input.Group>*/}
                <Button onClick={onApplyFilter} style={{marginTop: 20}} danger block type="primary">APPLY
                    FILTER</Button>
            </FilterContainer>
            <ProductListContainer>
                <SortHeader>
                    <span>Showing <b>{productPageable.totalElements || 0}</b> of <b>{productPageable.totalElements || 0}</b> Products</span>
                </SortHeader>
                <ProductsContainer>
                    {productPageable.content.map((item) => <Product item={item} key={item.id}/>)}
                </ProductsContainer>
            </ProductListContainer>
        </Content>
    </Container>);
};

export default FilterProducts;
