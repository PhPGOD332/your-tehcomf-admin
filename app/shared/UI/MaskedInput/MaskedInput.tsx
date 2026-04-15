import React, {ChangeEvent, forwardRef} from 'react';
import styles from './MaskedInput.module.scss';
import {InputMask} from "@react-input/mask";
import type { FieldError } from "react-hook-form";

interface IReplacement {
    [item: string]: RegExp;
}

interface MaskedInputProps {
    label?: string;
    value?: string;
    placeholder?: string;
    classNames?: string;
    mask: string;
    replacement: IReplacement;
    onChange?: (e: React.ChangeEvent) => void;
    showMask?: boolean;
    id?: string;
    name?: string;
    error?: FieldError;
    isPlaceholderError?: boolean;
}

const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>((
    {
        mask,
        replacement,
        label,
        value,
        placeholder,
        classNames,
        showMask,
        id,
        name,
        // onChange,
        error,
        isPlaceholderError,
        ...props
    }: MaskedInputProps, ref) => {

    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const label = e.currentTarget?.parentElement;
        if (!label) return;

        if (e.currentTarget.value.length > 0) {
            label.classList.add(styles.maskedLabel_active);
        } else {
            label.classList.remove(styles.maskedLabel_active);
        }
    }

    // useEffect(() => {
    //     console.log(error)
    // }, [error]);

    return (
        <label htmlFor="" className={`${styles.maskedLabel} ${error && isPlaceholderError ? styles.maskedLabel_placeholderError : error ? styles.maskedLabel_error : ''}`}>
            {label}
            <InputMask
                mask={mask}
                replacement={replacement}
                showMask={showMask}
                onChange={(e) => inputHandler(e)}
                // onInput={(e) => inputHandler(e)}
                placeholder={placeholder || ''}
                className={`${classNames ? styles.maskedInput + ' ' + classNames : styles.maskedInput}`}
                id={id || ''}
                name={name || ''}
                value={value || undefined}
                ref={ref}
                {...props}
            />
            {!isPlaceholderError ?
                <span className={styles.errorSpan}>{error ? error.message : ''}</span>
                :
                ''
            }
        </label>
    );
});

MaskedInput.displayName = 'MaskedInput';

export default MaskedInput;