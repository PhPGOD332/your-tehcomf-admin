import React from 'react';
import type { Route } from "./+types/login";
import styles from '~/shared/styles/pages/login.module.scss';
import LoginForm from "~/widgets/LoginForm/LoginForm";
import {observer} from "mobx-react-lite";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Авторизация" },
        // { name: "description", content: "Welcome to React Router!" },
    ];
}

const Login = () => {

    return (
        <div className={styles.wrapper}>
            <LoginForm/>
        </div>
    );
};

export default observer(Login);