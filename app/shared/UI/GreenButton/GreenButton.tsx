'use client'
import React from 'react';
import styles from './GreenButton.module.scss';

export enum ButtonType {
    BUTTON = 'button',
    RESET = 'reset',
    SUBMIT = 'submit',
}

interface ButtonProps {
    classNames?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    children: React.ReactNode;
    ref?: React.RefObject<HTMLButtonElement | null>;
    isMobileSmall?: boolean;
    type?: ButtonType;
}

const GreenButton = ({children, classNames, onClick, ref, isMobileSmall = false, type = ButtonType.BUTTON}: ButtonProps) => {
    return (
        <button
            className={`${classNames ? classNames + ' ' + styles.greenButton : styles.greenButton} ${isMobileSmall ? styles.greenButtonMobileSmall : styles.greenButtonMobile}`}
            onClick={(e) => onClick ? onClick(e) : ''}
            ref={ref || null}
            type={type}
        >
            <span className={styles.buttonCaption}>{children}</span>
            <svg className={styles.buttonIcon} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1642_68)">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M3.19971 14.56V17.6H6.23971L15.0397 8.72001L11.9997 5.68001L3.19971 14.56ZM17.3597 6.40001C17.6797 6.08001 17.6797 5.60001 17.3597 5.28001L15.5197 3.44001C15.1997 3.12001 14.7197 3.12001 14.3997 3.44001L12.9597 4.88001L15.9997 7.92001L17.3597 6.40001Z"
                          fill="#FAFAFA"/>
                </g>
                <defs>
                    <clipPath id="clip0_1642_68">
                        <rect width="14.4" height="14.4" fill="white" transform="translate(3.19971 3.20001)"/>
                    </clipPath>
                </defs>
            </svg>
        </button>
    );
};

export default GreenButton;