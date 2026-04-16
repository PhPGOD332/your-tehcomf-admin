import React, { useContext } from 'react';
import styles from './Dashboard.module.scss';
import { Link, useNavigate } from "react-router";
import { pagesLinks } from "~/shared/constants";
import { Context } from "~/root";
import { observer } from "mobx-react-lite";
import MiniTitle from "~/shared/UI/MiniTitle/MiniTitle";

const Dashboard = () => {
    const { rootStore } = useContext(Context);
    const navigate = useNavigate();

    const logoutHandler = async () => {
        const response = await rootStore.logout();

        if (response.success) {
            navigate('/login');
        }
    }

    return (
        <nav className={styles.wrapper}>
            <div className={styles.content}>
                <MiniTitle>Меню</MiniTitle>
                <div className={styles.menu}>
                    <div className={styles.list}>
                        <Link to={pagesLinks.home}
                              className={`${styles.item} ${location.pathname.startsWith(pagesLinks.home) ? styles.item_active : ''}`}
                        >
                            Главная
                        </Link>
                        <Link to={pagesLinks.portfolio}
                              className={`${styles.item} ${location.pathname.startsWith(pagesLinks.portfolio) ? styles.item_active : ''}`}
                        >
                            Портфолио
                        </Link>
                    </div>
                    <div className={styles.profile}>
                        <button className={styles.button} onClick={logoutHandler}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M9 3L5 3C4.46957 3 3.96086 3.21072 3.58579 3.58579C3.21072 3.96086 3 4.46957 3 5L3 19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21L9 21"
                                    stroke="#00A651" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M14 7L9 12L14 17" stroke="#00A651" strokeWidth="2.2" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                                <path d="M9 12L21 12" stroke="#00A651" strokeWidth="2.2" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <span>{rootStore.user.email}</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default observer(Dashboard);