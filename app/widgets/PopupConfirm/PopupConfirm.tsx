import React, {useEffect, useRef} from 'react';
import {observer} from "mobx-react-lite";
import styles from './PopupConfirm.module.scss';
import MiniTitle from "~/shared/UI/MiniTitle/MiniTitle";
import GreenButton from "~/shared/UI/GreenButton/GreenButton";

interface PopupProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    answerHandler: (answer: boolean) => void;
    question: string;
    deleteId: number;
}

const PopupConfirm = (
    {
        isOpen,
        setIsOpen,
        answerHandler,
        question,
        deleteId
    }: PopupProps
) => {
    const popupBgRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('overflowYHidden');
        } else {
            document.body.classList.remove('overflowYHidden');
        }
    }, [isOpen]);

    const bgPopupHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === popupBgRef.current)
            setIsOpen(false);
    }

    return (
        <div
            className={`${styles.popupWrapper} ${!isOpen && styles.popupWrapper_hidden}`}
            onClick={(e) => bgPopupHandler(e)}
        >
            <div className={styles.popupContent}>
                <span className={styles.question}>{question}</span>
                <div className={styles.buttons}>
                    <GreenButton
                        classNames={styles.answerButton}
                        onClick={() => answerHandler(true)}
                    >Да</GreenButton>
                    <GreenButton
                        classNames={styles.answerButton}
                        onClick={() => setIsOpen(false)}
                    >Нет</GreenButton>
                </div>

            </div>
        </div>
    );
};

export default observer(PopupConfirm);