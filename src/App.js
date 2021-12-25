import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import Home from "./pages/Home";
import styled from "styled-components";
import Navbar from "./components/Navbar";
import "./App.css";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {SnackbarProvider} from 'notistack';
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import AlertNotification from "./components/AlertNotification";
import {Spin} from "antd";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import {resetNotification} from "./redux/alertRedux";
import NotFound from "./pages/NotFound";
import BaseAdmin from "./pages/BaseAdmin";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import SuccessCheckout from "./pages/SuccessCheckout";
import FilterProducts from "./pages/FilterProducts";

const Container = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

function App() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const currentUser = useSelector((state) => state.user.currentUser);

    useEffect(() => {
        dispatch(resetNotification());
        setLoading(false);
    }, []);

    if (loading) {
        return <div style={{display: "flex", justifyContent: "center"}}>
            <Spin tip="Loading..."/>
        </div>
    }

    return (
        <Router>
            <SnackbarProvider maxSnack={2}
                              autoHideDuration={2000}
                              anchorOrigin={{vertical: "top", horizontal: "center"}}>
                <Container>
                    <Navbar/>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route exact path={"/cart"} component={Cart}/>
                        <Route exact path={"/filter-products"} component={FilterProducts}/>
                        <PrivateRoute exact path="/profile" component={Profile}/>
                        <PrivateRoute exact path="/wishlist" component={Wishlist}/>
                        <PrivateRoute exact path="/checkout" component={Checkout}/>
                        <PrivateRoute exact path="/checkout-success" component={SuccessCheckout}/>
                        <PrivateRoute exact path="/admin" component={BaseAdmin}/>
                        <Route path={"/products/:id"} component={ProductDetails}/>
                        <Route path="/login">
                            {currentUser ? <Redirect to="/"/> : <Login/>}
                        </Route>
                        <Route path="/register">
                            {currentUser ? <Redirect to="/"/> : <Register/>}
                        </Route>
                        <Route component={NotFound}/>
                    </Switch>
                    <Footer/>
                    <AlertNotification/>
                </Container>
            </SnackbarProvider>
        </Router>
    );
}

export default App;
