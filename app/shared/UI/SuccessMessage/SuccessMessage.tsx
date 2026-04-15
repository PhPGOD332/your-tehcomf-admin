import React, {useEffect, useState} from 'react';
import styles from './SuccessMessage.module.scss';

interface MessageProps {
    message: string;
    activate: boolean;
    setActivate: (isActive: boolean) => void;
}

const SuccessMessage = (
    {
        message,
        activate,
        setActivate
    }: MessageProps
) => {

    const activateHandler = (isActive: boolean) => {
        if (isActive) {
            const timeout = setTimeout(() => {
                setActivate(false)
            }, 2000);

            clearTimeout(timeout);
        }
    }

    useEffect(() => {
        activateHandler(activate);
    }, [activate]);

    return (
        <div className={`${styles.wrapper} ${activate && styles.wrapper_active}`}>
            <span className={styles.message}>{message}</span>
        </div>
    );
};

export default SuccessMessage;