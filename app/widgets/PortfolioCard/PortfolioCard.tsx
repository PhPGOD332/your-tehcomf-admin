import React, {useEffect, useRef, useState} from 'react';
import styles from './PortfolioCard.module.scss';
import type {IWork} from "~/types/IWork";
import MiniTitle from "~/shared/UI/MiniTitle/MiniTitle";
import SliderImagesHover from "~/widgets/SliderHover/SliderImagesHover";
import {Link} from "react-router";
import {pagesLinks} from "~/shared/constants";

interface ICardProps {
    work: IWork;
    openPopupDeleteHandler: (work: IWork) => void;
}

const PortfolioCard = React.memo((
    {
        work,
        openPopupDeleteHandler
    }: ICardProps
) => {
    const imageBlockRef = useRef<HTMLDivElement | null>(null);
    const [imageBlockWidth, setImageBlockWidth] = useState<number>(0);

    useEffect(() => {
        const imageBlock = imageBlockRef.current;
        if (!imageBlock) return;

        setImageBlockWidth(imageBlock.clientWidth);
    }, []);

    return (
        <div
            // href={`${pagesLinks.portfolio}/${work.name}`}
            className={styles.card}
        >
            <div
                className={styles.imageBlock}
                ref={imageBlockRef}
            >
                <div className={styles.panel}>
                    <Link className={styles.actionButton} to={`${pagesLinks.portfolio}/${work.name}`}>
                        <svg width="30" height="30" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M54.4 22.56C53.5513 22.56 52.7374 22.8971 52.1373 23.4973C51.5372 24.0974 51.2 24.9113 51.2 25.76V44.8C51.195 46.4958 50.519 48.1207 49.3199 49.3199C48.1208 50.519 46.4959 51.1949 44.8 51.2H19.2C17.5042 51.1949 15.8793 50.519 14.6801 49.3199C13.481 48.1207 12.8051 46.4958 12.8 44.8V19.2C12.8051 17.5042 13.481 15.8792 14.6801 14.6801C15.8793 13.481 17.5042 12.8051 19.2 12.8H38.24C39.0887 12.8 39.9026 12.4629 40.5028 11.8627C41.1029 11.2626 41.44 10.4487 41.44 9.59999C41.44 8.7513 41.1029 7.93737 40.5028 7.33725C39.9026 6.73714 39.0887 6.39999 38.24 6.39999H19.2C15.8084 6.41012 12.5585 7.76194 10.1602 10.1602C7.76197 12.5585 6.41015 15.8083 6.40002 19.2V44.8C6.41015 48.1916 7.76197 51.4415 10.1602 53.8398C12.5585 56.238 15.8084 57.5899 19.2 57.6H44.8C48.1917 57.5899 51.4415 56.238 53.8398 53.8398C56.2381 51.4415 57.5899 48.1916 57.6 44.8V25.76C57.6 24.9113 57.2629 24.0974 56.6628 23.4973C56.0627 22.8971 55.2487 22.56 54.4 22.56ZM29.76 35.04C30.049 35.3432 30.3966 35.5846 30.7816 35.7495C31.1666 35.9145 31.5811 35.9995 32 35.9995C32.4189 35.9995 32.8334 35.9145 33.2185 35.7495C33.6035 35.5846 33.951 35.3432 34.24 35.04L52.64 16.64C53.2242 16.0439 53.5496 15.2413 53.5454 14.4066C53.5411 13.572 53.2077 12.7727 52.6175 12.1825C52.0273 11.5923 51.228 11.2589 50.3934 11.2547C49.5587 11.2504 48.7562 11.5758 48.16 12.16L29.76 30.56C29.4568 30.849 29.2154 31.1965 29.0505 31.5816C28.8855 31.9666 28.8005 32.3811 28.8005 32.8C28.8005 33.2189 28.8855 33.6334 29.0505 34.0184C29.2154 34.4035 29.4568 34.751 29.76 35.04Z"
                                fill="#00A651"/>
                        </svg>
                    </Link>
                    <button
                        className={styles.actionButton}
                        onClick={() => openPopupDeleteHandler(work)}
                    >
                        <svg width="30" height="30" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M54 16H46V11C46 8.79375 44.2062 7 42 7H22C19.7938 7 18 8.79375 18 11V16H10C8.89375 16 8 16.8937 8 18V20C8 20.275 8.225 20.5 8.5 20.5H12.275L13.8188 53.1875C13.9188 55.3187 15.6813 57 17.8125 57H46.1875C48.325 57 50.0813 55.325 50.1813 53.1875L51.725 20.5H55.5C55.775 20.5 56 20.275 56 20V18C56 16.8937 55.1063 16 54 16ZM41.5 16H22.5V11.5H41.5V16Z"
                                fill="#00A651"/>
                        </svg>
                    </button>
                </div>
                {work && work.images && work.images.length > 0 && imageBlockWidth > 0 ?
                    <SliderImagesHover
                        widthSlider={imageBlockWidth}
                        images={work.images}
                    />
                    :
                    ''
                }
            </div>
            <div className={styles.description}>
                <div className={styles.tags}>
                    {[work.tableTopColor, work.bodyColor, ...work.facadeColors]
                        .filter((color, num, self) => num === self.findIndex((c) => c && color && c.hexCode === color.hexCode))
                        .filter((color, num) => num < 3)
                        .map((color, num) =>
                            <div
                                key={num}
                                className={`${styles.tag}`}
                                style={color.name === 'white' ? {
                                    backgroundColor: color.hexCode,
                                    border: '1.5px solid #58595B'
                                } : {backgroundColor: color.hexCode}}></div>
                        )}
                </div>
                <div className={styles.type}>
                    <span className={styles.typeSpan}>{work.type.caption ?? ''}</span>
                </div>
                <div className={styles.titleBlock}>
                    <MiniTitle classNames={styles.cardTitle}>{work.title ?? ''}</MiniTitle>
                </div>
                <div className={styles.categories}>
                    <span className={`${styles.category} ${styles.firstCategory}`}>{work.style.caption}</span>
                    <span className={`${styles.category}`}>{work.layout.caption ?? ''}</span>
                </div>
            </div>
        </div>
    );
});

PortfolioCard.displayName = 'PortfolioCard';

export default PortfolioCard;