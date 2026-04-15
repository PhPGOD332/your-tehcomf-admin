import type { Route } from "./+types/home";
import {observer} from "mobx-react-lite";
import styles from '~/shared/styles/pages/home.module.scss';
import React, {useContext} from "react";
import {Context} from "~/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Главная" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const Home = () => {
  const { rootStore } = useContext(Context);



  return <>
    <div className={styles.container}>
      <h1 className={styles.title}>Добро пожаловать, { rootStore.user.email }</h1>
    </div>
  </>;
}

export default observer(React.forwardRef(Home));