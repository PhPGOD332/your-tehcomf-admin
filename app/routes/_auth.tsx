import React, {useContext, useEffect, useState} from 'react';
import {Outlet, useNavigate} from "react-router";
import type {Route} from "./+types/_auth";
import {observer} from "mobx-react-lite";
import {Context} from "~/root";
import GifImage from "~/shared/UI/GifImage/GifImage";
import Gif from '~/data/images/gifs/loading.gif';
import styles from '~/shared/styles/pages/_auth.module.scss';
import Dashboard from "~/widgets/Dashboard/Dashboard";

export async function loader({ request }: Route.LoaderArgs) {



    return null;
}

const AuthLayout = () => {
    const { rootStore } = useContext(Context);
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState<boolean>(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await rootStore.checkAuth();

                if (!rootStore.isAuth) {
                    navigate('/login');
                }
            } catch (e) {
                console.log(e.message);
                navigate('/login');
            } finally {
                setIsChecking(false);
            }
        }

        checkAuth();
    }, [rootStore, navigate]);

    if (isChecking) {
        return (
            <div className={'loading'}>
                <GifImage src={Gif} classNames={styles.gifBlock} />
            </div>
        );
    }

    return (
        <main className={styles.main}>
            <Dashboard />
            <div className={styles.content}>
                <Outlet />
            </div>
        </main>
    );
};

export default observer(AuthLayout);