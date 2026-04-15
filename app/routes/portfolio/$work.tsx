import React, {useContext, useEffect, useState} from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "~/root";
import { useNavigate, useParams } from "react-router";
import PortfolioEditView from "~/view/PortfolioEditView/PortfolioEditView";
import type { Route } from "./+types/$work";

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

export function HydrateFallback() {
    return <div>Загрузка...</div>;
}

const Work = ({ loaderData }: Route.ComponentProps) => {
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
        return <div>Загрузка...</div>
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