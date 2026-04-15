'use client'
import React, {useEffect, useState} from 'react';
import styles from './PortfolioView.module.scss';
import SubTitle from "~/shared/UI/SubTitle/SubTitle";
import MiniTitle from "~/shared/UI/MiniTitle/MiniTitle";
import type {IWork} from "~/types/IWork";
import PortfolioCard from "~/widgets/PortfolioCard/PortfolioCard";
import GreenButton from "~/shared/UI/GreenButton/GreenButton";
import PopupConfirm from "~/widgets/PopupConfirm/PopupConfirm";
import {rootStore} from "~/store/store";

interface PortfolioProps {
    title: string;
    works: IWork[];
}

const PortfolioView = (
    {
        title,
        works = []
    }: PortfolioProps
) => {
    const [currentCount, setCurrentCount] = useState<number>(11);
    const step = 6;
    const [allWorks, ] = useState<IWork[]>(works ?? []);
    const [currentWorks, setCurrentWorks] = useState<IWork[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<number>(null);

    const getCountedWorks = (works: IWork[]) => {
        return works.filter((work, num) => num <= currentCount)
    }

    useEffect(() => {
        setCurrentWorks(getCountedWorks(allWorks));
    }, []);

    useEffect(() => {
        setCurrentWorks(works.filter((work, num) => num - 1 <= currentCount));
    }, [currentCount]);

    const moreClickHandle = () => {
        setCurrentCount(currentCount + step);
    }

    const openPopupDeleteHandler = (work: IWork) => {
        setDeleteId(work.id);
        setIsOpen(true);
    }

    const confirmDeleteHandler = async (answer: boolean) => {
        if (answer) {
            await rootStore.deleteWork(deleteId);
            setDeleteId(null);
        }
    }

    return (
        <>
            <div className={styles.portfolioView}>
                <div className={'container'}>
                    <div className={styles.titleBlock}>
                        <SubTitle classNames={styles.title}>{title}</SubTitle>
                        <GreenButton classNames={styles.actionButton}>Создать работу</GreenButton>
                    </div>
                    <div
                        className={`${styles.portfolioBlock} ${!currentWorks || currentWorks.length === 0 ? styles.portfolioBlock_empty : ''}`}>
                        {currentWorks && currentWorks.length > 0 ?
                            currentWorks.map((work, num) =>
                                <PortfolioCard
                                    key={num}
                                    work={work}
                                    openPopupDeleteHandler={openPopupDeleteHandler}
                                />
                            )
                            :
                            <div className={styles.emptyBlock}>
                                <MiniTitle classNames={styles.emptySpan}>Упс.. Ничего не найдено</MiniTitle>
                            </div>
                        }
                    </div>
                    {works && works.length > currentCount - 1 ?
                        <div className={styles.moreBtnBlock}>
                            <GreenButton classNames={styles.moreBtn} onClick={moreClickHandle}>Показать
                                еще</GreenButton>
                        </div>
                        :
                        ''
                    }
                </div>
            </div>
            <PopupConfirm
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                question={'Вы уверены, что хотите удалить работу?'}
                deleteId={deleteId}
                answerHandler={confirmDeleteHandler}
            />
        </>
    );
};

export default PortfolioView;