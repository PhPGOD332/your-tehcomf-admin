import React, {forwardRef} from 'react';
import styles from './NumInput.module.scss';
import type {FieldError} from "react-hook-form";
import TextInput, {InputType} from "~/shared/UI/TextInput/TextInput";

interface NumInputProps {
    type?: InputType;
    placeholder?: string;
    disabled?: boolean;
    label?: string;
    classNames?: string;
    id?: string;
    name?: string;
    error?: FieldError;
    value?: string;
    setValue?: (val: string) => void;
}

const NumInput = forwardRef<HTMLInputElement, NumInputProps>((
    {
        type = InputType.TEXT,
        classNames,
        label,
        placeholder,
        disabled,
        id,
        name,
        error,
        value,
        setValue,
        ...props
    }: NumInputProps, ref) => {

    const inputHandler = (e: React.SyntheticEvent<HTMLInputElement>) => {
        const label = e.currentTarget?.parentElement;
        if (!label) return;

        setValue ? setValue(e.currentTarget.value ?? '') : null;

        if (e.currentTarget.value.length > 0)
            label.classList.add(styles.inputLabel_active);
        else
            label.classList.remove(styles.inputLabel_active);
    }

    return (
        <label htmlFor=""
               className={`${styles.inputLabel} ${error ? styles.inputLabel_placeholderError : error ? styles.inputLabel_error : ''}`}>
            {label}
            <input
                type={type}
                disabled={disabled ?? false}
                placeholder={error ? error.message : placeholder}
                className={`${classNames ? styles.textInput + ' ' + classNames : styles.textInput}`}
                id={id}
                name={name}
                value={value}
                onInput={(e) => inputHandler(e)}
                // onChange={(e) => inputHandler(e)}
                ref={ref}
                {...props}
            />
            {error ?
                <span className={styles.errorSpan}>{error ? error.message : ''}</span>
                :
                ''
            }
        </label>
    );
});

NumInput.displayName = 'NumInput';

export default NumInput;