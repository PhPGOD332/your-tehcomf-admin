import React, {useEffect, useState} from 'react';
import styles from './SuccessMessage.module.scss';

interface MessageProps {
    message: string;
}

const SuccessMessage = (
    {
        message,
    }: MessageProps
) => {
    const [active, setActive] = useState(false);

    useEffect(() => {
        setActive(true);
    }, []);

    useEffect(() => {
        if (active) {
            setTimeout(() => {
                setActive(false);
            }, 2000);
        }
    }, [active]);

    return (
        <div className={`${styles.wrapper} ${active && styles.wrapper_active}`}>
            <span className={styles.message}>{message}</span>
        </div>
    );
};

export default SuccessMessage;