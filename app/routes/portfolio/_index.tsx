import React, { useContext } from 'react';
import { observer } from "mobx-react-lite";
import PortfolioView from "~/view/PortfolioView/PortfolioView";
import type { Route } from "./+types/_index";
import { Context } from "~/root";
import Gif from '~/data/images/gifs/loading.gif';
import GifImage from "~/shared/UI/GifImage/GifImage";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Портфолио" },
        // { name: "description", content: "Welcome to React Router!" },
    ];
}

export async function clientLoader() {
    const { rootStore } = await import('~/store/store');

    await rootStore.getAllWorks();
}

const _index = () => {
    const { rootStore } = useContext(Context);

    if (rootStore.isLoading) {
        return <div className={'loading'}>
            <GifImage src={Gif} classNames={'gifBlock'}/>
        </div>;
    }

    return (
        <PortfolioView
            title={'Список работ портфолио'}
            works={rootStore.works}
        />
    );
};

export default observer(_index);