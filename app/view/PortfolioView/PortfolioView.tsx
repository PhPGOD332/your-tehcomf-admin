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
import {Link} from "react-router";
import {pagesLinks} from "~/shared/constants";
import SuccessMessage from "~/shared/UI/SuccessMessage/SuccessMessage";

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
    const [allWorks, setAllWorks] = useState<IWork[]>(works.sort((w1, w2) => w2.id - w1.id) ?? []);
    const [currentWorks, setCurrentWorks] = useState<IWork[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<number>(null);
    const [statusNotes, setStatusNotes] = useState<React.ReactNode[]>([]);

    const getCountedWorks = (works: IWork[]) => {
        return works.filter((work, num) => num <= currentCount);
    }

    useEffect(() => {
        setCurrentWorks(getCountedWorks(allWorks));
    }, []);

    useEffect(() => {
        setCurrentWorks(works.filter((work, num) => num - 1 <= currentCount));
    }, [currentCount]);

    const deleteStatusNote = () => {
        if (statusNotes.length > 0) {
            setTimeout(() => {
                const reversedStatusNotes = statusNotes;
                reversedStatusNotes.shift();
                setStatusNotes(reversedStatusNotes);
            }, 3000);
        }
    }

    const moreClickHandle = () => {
        setCurrentCount(currentCount + step);
    }

    const openPopupDeleteHandler = (work: IWork) => {
        setDeleteId(work.id);
        setIsOpen(true);
    }

    const confirmDeleteHandler = async (answer: boolean) => {
        setIsOpen(false);
        if (answer) {
            const response = await rootStore.deleteWork(deleteId);

            if (response && response.success) {
                setDeleteId(null);
                const works = await rootStore.getAllWorks();
                setAllWorks(works);
                setCurrentWorks(getCountedWorks(works));

                setStatusNotes([...statusNotes, <SuccessMessage message={'Работа успешно удалена'} key={statusNotes.length} />]);
                deleteStatusNote();
            } else {
                setStatusNotes([...statusNotes, <SuccessMessage message={'При удалении произошла ошибка'} key={statusNotes.length} />]);
            }
        } else {
            setStatusNotes([...statusNotes, <SuccessMessage message={'Операция отменена пользователем'} key={statusNotes.length} />]);
        }
    }

    return (
        <>
            <div className={styles.portfolioView}>
                <div className={'container'}>
                    <div className={styles.titleBlock}>
                        <SubTitle classNames={styles.title}>{title}</SubTitle>
                        <Link to={`${pagesLinks.portfolio}/new`} className={styles.actionButton}>Создать работу</Link>
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
                answerHandler={confirmDeleteHandler}
            />
            {statusNotes ?? ''}
        </>
    );
};

export default PortfolioView;