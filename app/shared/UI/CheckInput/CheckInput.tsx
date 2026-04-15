'use client'
import React, {ChangeEvent, ForwardedRef, forwardRef, RefObject, useEffect, useId, useState} from 'react';
import styles from './CheckInput.module.scss';
import {Control, FieldError, FieldPath, useController, UseControllerProps} from "react-hook-form";
import type {TFormInputs} from "~/types/TFormInputs";

interface CheckProps {
    caption: string;
    firstIsChecked?: boolean;
    labelRef?: RefObject<HTMLLabelElement | null>;
    changeHandle?: (currentRef: RefObject<HTMLLabelElement | null> | null) => void;
    customIsChecked?: boolean;
    setCustomIsChecked?: (checked: boolean) => void;
    classNames?: string;
    error?: FieldError;
    control?: Control<TFormInputs>;
    name: FieldPath<TFormInputs>;
    props?: UseControllerProps;
}

const CheckInput = forwardRef<HTMLInputElement, CheckProps>((
    {
        caption,
        firstIsChecked = false,
        labelRef,
        changeHandle,
        customIsChecked,
        setCustomIsChecked,
        classNames,
        // error,
        control,
        name,
        props
    }: CheckProps,
    ref: ForwardedRef<HTMLInputElement>) => {

    const {
        field: { onChange }
    } = useController({
        control,
        name
    });
    const [isChecked, setIsChecked] = useState(firstIsChecked ?? false);
    const id = useId();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked);

        if (customIsChecked && setCustomIsChecked) {
            setCustomIsChecked(e.target.checked);
        } else {
            setIsChecked(e.target.checked);
        }

        if (changeHandle)
            changeHandle(labelRef ?? null);
    }

    useEffect(() => {
        onChange(customIsChecked);
        setIsChecked(customIsChecked ?? false);
    }, [customIsChecked]);

    return (
        <label
            className={`${isChecked ? styles.checkLabel_checked : styles.checkLabel} ${classNames ?? ''}`}
            ref={labelRef}
            htmlFor={id}
        >
            <span className={styles.checkSpan}>{caption}</span>
            <input
                type="checkbox"
                className={styles.checkInput}
                checked={isChecked}
                // onClick={(e) => checkHandler(e)}
                onChange={(e) => handleChange(e)}
                ref={ref}
                {...props}
                id={id}
            />
            <div className={`${isChecked ? styles.checkIcon_checked : styles.checkIcon}`}>
                {isChecked
                    &&
                <svg width="12.5" height="7" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4.5L3.2706 7.14903C3.65929 7.60251 4.35624 7.61636 4.76265 7.17869L10.5 1"
                          stroke="#FAFAFA" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                }
            </div>
        </label>
    );
});

CheckInput.displayName = 'CheckInput';

export default CheckInput;