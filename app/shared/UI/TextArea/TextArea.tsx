'use client'
import React, { ChangeEvent, forwardRef } from 'react';
import styles from './TextArea.module.scss';
import type { FieldError } from "react-hook-form";

interface TextareaProps {
    label?: string;
    children?: React.ReactNode;
    placeholder?: string;
    classNames?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number;
    cols?: number;
    id?: string;
    name?: string;
    isResizable?: boolean;
    error?: FieldError;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextareaProps>((
    {
        label,
        children,
        placeholder,
        classNames,
        rows = 30,
        cols = 10,
        id,
        name,
        isResizable = false,
        error,
        ...props
    }: TextareaProps, ref) => {

    const inputHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const label = e.currentTarget?.parentElement;

        if (!label) return;

        if (e.currentTarget.value.length > 0)
            label.classList.add(styles.textareaLabel_active);
        else
            label.classList.remove(styles.textareaLabel_active);
    }

    return (
        <label className={`${styles.textareaLabel} ${error ? styles.textareaLabel_error : ''}`}>
            {label}
            <textarea
                name={name || ''}
                id={id || ''}
                cols={cols}
                rows={rows}
                placeholder={placeholder}
                className={`${classNames ? styles.textarea + ' ' + classNames : styles.textarea}`}
                onChange={(e) => inputHandler(e)}
                style={{resize: isResizable ? "both" : "none"}}
                ref={ref}
                {...props}
            >{children || undefined}</textarea>
            <span className={styles.errorSpan}>{error ? error.message : ''}</span>
        </label>
    );
});

TextArea.displayName = 'TextArea';

export default TextArea;