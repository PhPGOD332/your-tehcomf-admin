import React from 'react';
import { DefaultTemplate } from "~/shared/lexkit/DefaultTemplate";
import styles from './LexkitEditor.module.scss';

interface EditorProps {
    label?: string;
    value?: string;
    setValue?: (val: string) => void;
    setNewFileHandler?: (file: File) => void;
    setDeleteFileHandler?: (title: string) => void;
}

const LexkitEditor = (
    {
        label,
        value,
        setValue,
        setNewFileHandler,
        setDeleteFileHandler
    }: EditorProps
) => {

    const changeHandler = ({ markdown, html }) => {
        setValue ? setValue(html) : null;
    }

    return (
        <>
            <label className={styles.maskedLabel}>
                {label}
            </label>
            <DefaultTemplate
                onReady={(editor) => {
                    editor.injectHTML(value ?? 'Описание');
                }}
                onChange={changeHandler}
                setNewFileHandler={setNewFileHandler}
                setDeleteFileHandler={setDeleteFileHandler}
            />

        </>
    );
};

export default LexkitEditor;