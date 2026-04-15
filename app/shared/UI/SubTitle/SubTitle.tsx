import React from 'react';
import styles from './SubTitle.module.scss';

export enum TitleColors {
    BLACK = 'black',
    WHITE = 'white',
    GRAY = 'gray'
}

export interface TitleProps {
    color?: TitleColors;
    classNames?: string;
    children: React.ReactNode;
    htmlContent?: string;
}

const SubTitle = ({children, htmlContent, color, classNames}: TitleProps) => {
    const getColorStyle = (color: TitleColors): string => {
        let checkColor: never;

        switch (color) {
            case TitleColors.WHITE:
                return styles.white;
            case TitleColors.BLACK:
                return styles.black;
            case TitleColors.GRAY:
                return styles.gray;
            default:
                checkColor = color;
                return checkColor;
        }
    }

    return (
        <>
            {htmlContent ?
                <h2
                    className={`${styles.subTitle} ${color ? getColorStyle(color) : getColorStyle(TitleColors.BLACK)} ${classNames ?? ''}`}
                    dangerouslySetInnerHTML={{__html: htmlContent ?? ''}}
                >
                </h2>
                :
                <h2
                    className={`${styles.subTitle} ${color ? getColorStyle(color) : getColorStyle(TitleColors.BLACK)} ${classNames ?? ''}`}
                >
                    {children}
                </h2>
            }
        </>
    );
};

export default SubTitle;