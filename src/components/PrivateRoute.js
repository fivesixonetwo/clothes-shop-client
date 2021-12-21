import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {useSelector} from "react-redux";

const PrivateRoute = ({component: Component, ...rest}) => {
    const currentUser = useSelector((state) => state.user.currentUser);
    return (
        <Route
            {...rest}
            render={(routeProps) => (
                currentUser ? <Component {...routeProps} /> : <Redirect to={{
                    pathname: "/login",
                    state: {from: routeProps.location}
                }}/>
            )}
        />
    );
};

export default PrivateRoute;