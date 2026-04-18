import React, {useContext, useEffect, useState} from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "~/root";
import { useNavigate, useParams } from "react-router";
import PortfolioEditView from "~/view/PortfolioEditView/PortfolioEditView";
import type { Route } from "./+types/$work";
import GifImage from "~/shared/UI/GifImage/GifImage";
import Gif from "~/data/images/gifs/loading.gif";
import styles from "~/shared/styles/pages/_auth.module.scss";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Редактирование работы портфолио" },
        // { name: "description", content: "Welcome to React Router!" },
    ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const { rootStore } = await import('~/store/store');
    const work = await rootStore.getWork(params.name ?? '');
    const types = await rootStore.getTypes();
    const filterColors = await rootStore.getFilterColors();
    const colors = await rootStore.getColors();
    const layouts = await rootStore.getLayouts();
    const styles = await rootStore.getStyles();

    return { work, types, filterColors, colors, layouts, styles };
}

const Work = ({loaderData}: Route.ComponentProps) => {
    const [isClient, setIsClient] = useState<boolean>(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
    const navigate = useNavigate();
    const { rootStore } = useContext(Context);
    const { name } = useParams();
    const work = loaderData.work;
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
        <PortfolioEditView
            title={`Редактирование работы`}
            work={work}
            types={types}
            filterColors={filterColors}
            colors={colors}
            layouts={layouts}
            filterStyles={filterStyles}
        />
    );
};

export default observer(Work);