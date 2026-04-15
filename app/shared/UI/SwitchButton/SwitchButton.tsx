import React, {JSX} from 'react';
import styles from './SwitchButton.module.scss';
import type {IImage} from "~/types/IImage";
import {Link} from "react-router";

export enum SwitchButtonColors {
    GRAY, GREEN,
}

interface ButtonProps {
    color: SwitchButtonColors;
    image?: IImage;
    icon?: JSX.Element;
    isSwitch: boolean;
    previewText?: string;
    postViewText?: string;
    isOnlyMobileImage?: boolean;
    href?: string;
}

const SwitchButton = (
    {
        color = SwitchButtonColors.GRAY,
        image,
        icon,
        isSwitch,
        previewText,
        postViewText,
        isOnlyMobileImage,
        href
    }: ButtonProps) => {

    const getStyle = (color: SwitchButtonColors) => {
        let checkColors: never;

        if (isSwitch) {
            switch (color) {
                case SwitchButtonColors.GRAY:
                    return styles.switchContact_gray;
                case SwitchButtonColors.GREEN:
                    return styles.switchContact_green;
                default:
                    checkColors = color;
                    return checkColors;
                    // return styles.contact;
            }
        } else {
            switch (color) {
                case SwitchButtonColors.GRAY:
                    return styles.notSwitchContact_gray;
                case SwitchButtonColors.GREEN:
                    return styles.notSwitchContact_green;
                default:
                    checkColors = color;
                    return checkColors
                    // return styles.contact;
            }
        }
    }

    return (
        href ?
        <Link to={href ?? ''} className={`${styles.contact} ${getStyle(color)}`}>
            <div className={styles.contactPreview}>
                <div className={styles.previewImage}>
                    {image
                        ?
                        <img
                            className={`${styles.contactImage} ${isOnlyMobileImage && styles.contactImage_onlyMobile}`}
                            src={image.src}
                            alt={''}
                            width={44}
                            height={44}
                        />
                        :
                        ''
                    }
                    <span className={styles.caption}
                          style={{fontSize: image ? '19px' : '22px'}}>{previewText}</span>
                </div>
                <div className={styles.contactIcon}>
                    {icon ?? ''}
                </div>
            </div>
            {isSwitch
                &&
                <div className={`${styles.contactPostview} ${styles.hidden}`}>
                    <span className={styles.caption}>{postViewText}</span>
                </div>
            }
        </Link>
        :
        <div className={`${styles.contact} ${getStyle(color)}`}>
            <div className={styles.contactPreview}>
                <div className={styles.previewImage}>
                    {image
                        ?
                        <img
                            className={`${styles.contactImage} ${isOnlyMobileImage && styles.contactImage_onlyMobile}`}
                            src={image.src}
                            alt={''}
                            width={44}
                            height={44}
                        />
                        :
                        ''
                    }
                    <span className={styles.caption}
                          style={{fontSize: image ? '19px' : '22px'}}>{previewText}</span>
                </div>
                <div className={styles.contactIcon}>
                    {icon ?? ''}
                </div>
            </div>
            {isSwitch
                &&
                <div className={`${styles.contactPostview} ${styles.hidden}`}>
                    <span className={styles.caption}>{postViewText}</span>
                </div>
            }
        </div>
    );
};

export default SwitchButton;