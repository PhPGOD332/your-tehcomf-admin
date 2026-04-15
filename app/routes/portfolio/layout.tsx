import React from 'react';
import {Outlet} from "react-router";
import {observer} from "mobx-react-lite";

const Layout = () => {
    return (
        <Outlet />
    );
};

export default observer(Layout);