import React from 'react';
import styles from './GifImage.module.scss';

interface GifProps {
    src: string;
    alt?: string;
    classNames?: string;
}

const GifImage = (
    {
        src,
        alt,
        classNames
    }: GifProps
) => {
    return (
        <div className={`${styles.gifWrapper} ${classNames}`}>
            <img src={src} alt={alt} className={styles.gifImage} />
        </div>
    );
};

export default GifImage;