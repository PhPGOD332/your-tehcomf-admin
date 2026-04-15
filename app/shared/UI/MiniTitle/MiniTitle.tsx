import React from 'react';
import styles from './MiniTitle.module.scss';
import type {TitleProps} from "~/shared/UI/SubTitle/SubTitle";
import {TitleColors} from "~/shared/UI/SubTitle/SubTitle";

const MiniTitle = ({children, htmlContent, color, classNames}: TitleProps) => {
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
                <h3
                    className={`${classNames ? styles.miniTitle + ' ' + classNames : styles.miniTitle} ${color ? getColorStyle(color) : getColorStyle(TitleColors.BLACK)}`}
                    dangerouslySetInnerHTML={{__html: htmlContent ?? ''}}
                >
                </h3>
                :
                <h3
                    className={`${classNames ? styles.miniTitle + ' ' + classNames : styles.miniTitle} ${color ? getColorStyle(color) : getColorStyle(TitleColors.BLACK)}`}
                >
                    {children}
                </h3>
            }
        </>
    );
};

export default MiniTitle;