import React, { useContext, useEffect, useState } from 'react';
import { observer } from "mobx-react-lite";
import type { Route } from "./+types/new";
import GifImage from "~/shared/UI/GifImage/GifImage";
import Gif from "~/data/images/gifs/loading.gif";
import styles from "~/shared/styles/pages/_auth.module.scss";
import { useNavigate, useParams } from "react-router";
import { Context } from "~/root";
import PortfolioNewView from "~/view/PortfolioNewView/PortfolioNewView";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const { rootStore } = await import('~/store/store');
    const types = await rootStore.getTypes();
    const filterColors = await rootStore.getFilterColors();
    const colors = await rootStore.getColors();
    const layouts = await rootStore.getLayouts();
    const styles = await rootStore.getStyles();

    return { types, filterColors, colors, layouts, styles };
}

export function HydrateFallback() {
    return <div className={'loading'}>
        <GifImage src={Gif} classNames={styles.gifBlock} />
    </div>;
}

const New = ({ loaderData }: Route.ComponentProps) => {
    const [isClient, setIsClient] = useState<boolean>(false);
    const navigate = useNavigate();
    const { rootStore } = useContext(Context);
    const { name } = useParams();
    const work = loaderData.work;
    const types = loaderData.types;
    const filterColors = loaderData.filterColors;
    const colors = loaderData.colors;
    const layouts = loaderData.layouts;
    const filterStyles = loaderData.styles;

    if (!rootStore.isAuth) {
        navigate('/login');
    }

    useEffect(() => {
        if (localStorage.getItem('refreshToken')) {
            rootStore.checkAuth();
        }
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <div className={'loading'}>
            <GifImage src={Gif} classNames={styles.gifBlock}/>
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