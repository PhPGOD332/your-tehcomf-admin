import React, { useContext, useEffect, useState } from 'react';
import { observer } from "mobx-react-lite";
import type { Route } from "./+types/new";
import GifImage from "~/shared/UI/GifImage/GifImage";
import Gif from "~/data/images/gifs/loading.gif";
import styles from "~/shared/styles/pages/_auth.module.scss";
import { useNavigate, useParams } from "react-router";
import { Context } from "~/root";
import PortfolioNewView from "~/view/PortfolioNewView/PortfolioNewView";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Создание работы портфолио" },
        // { name: "description", content: "Welcome to React Router!" },
    ];
}

export async function clientLoader() {
    const { rootStore } = await import('~/store/store');
    const types = await rootStore.getTypes();
    const filterColors = await rootStore.getFilterColors();
    const colors = await rootStore.getColors();
    const layouts = await rootStore.getLayouts();
    const styles = await rootStore.getStyles();

    return { types, filterColors, colors, layouts, styles };
}

const New = ({ loaderData }: Route.ComponentProps) => {
    const [isClient, setIsClient] = useState<boolean>(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
    const navigate = useNavigate();
    const { rootStore } = useContext(Context);
    const types = loaderData.types;
    const filterColors = loaderData.filterColors;
    const colors = loaderData.colors;
    const layouts = loaderData.layouts;
    const filterStyles = loaderData.styles;

    useEffect(() => {
        if (localStorage.getItem('refreshToken')) {
            rootStore.checkAuth();
        }

        const checkAuth = async () => {
            setIsCheckingAuth(true);

            if (localStorage.getItem('refreshToken')) {
                await rootStore.checkAuth();
            }

            setIsCheckingAuth(false);
            setIsClient(true);
        };

        checkAuth();
        setIsClient(true);
    }, [rootStore]);

    useEffect(() => {
        if (isClient && !isCheckingAuth && !rootStore.isAuth) {
            navigate('/login');
        }
    }, [isClient, isCheckingAuth, rootStore.isAuth, navigate]);

    if (!isClient || isCheckingAuth) {
        return <div className={'loading'}>
            <GifImage src={Gif} classNames={'gifBlock'}/>
        </div>;
    }

    return (
        <PortfolioNewView
            title={`Создание работы`}
            types={types}
            filterColors={filterColors}
            colors={colors}
            layouts={layouts}
            filterStyles={filterStyles}
        />
    );
};

export default observer(New);