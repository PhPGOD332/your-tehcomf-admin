'use client'
import React, {useEffect, useState} from 'react';
import styles from './Select.module.scss';
import type { TFilter, TFiltersList } from "~/types/IFilters";
import type {IColor} from "~/types/IColor";

interface SelectProps {
    width?: number;
    caption: string;
    initialOption: TFilter;
    options: TFiltersList;
    changeHandle: (optionName: string) => void;
    label?: string;
}

const Select = (
    {
        width,
        caption,
        options,
        initialOption,
        changeHandle,
        label
    }: SelectProps
) => {
    const [currentOption, setCurrentOption] = useState<string>(initialOption.name ?? '');
    const [currentCaption, setCurrentCaption] = useState<string>(initialOption.caption ?? options[0].caption ?? '')
    const [isSelectActive, setIsSelectActive] = useState<boolean>(false);

    useEffect(() => {
        if (changeHandle)
            changeHandle(currentOption);
    }, [currentOption]);

    const selectClickHandle = () => {
        setIsSelectActive(!isSelectActive);
    }

    const changeOptionHandle = (option: TFilter) => {
        if (option.name === currentOption) {
            setCurrentOption('');
            setCurrentCaption(caption);
            setIsSelectActive(!isSelectActive);
            return;
        }

        setCurrentOption(option.name);
        setCurrentCaption(option.caption);
        setIsSelectActive(!isSelectActive);
    }

    return (
        <label htmlFor="" className={styles.inputLabel}>
            {label}
            <div
                className={`${styles.selectWrapper} ${isSelectActive ? styles.selectWrapper_active : styles.selectWrapper_inactive}`}>
                <div
                    className={styles.select}
                    style={width && {width: width}}
                    onClick={() => selectClickHandle()}
                >
                    <span className={styles.caption}>{currentCaption}</span>
                    <span className={styles.arrow}>
                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12.7998 0.800049L7.1855 6.41435C6.97249 6.62737 6.62712 6.62737 6.41411 6.41435L0.799804 0.800049"
                            stroke="#58595B" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                </span>
                </div>
                <div className={`${styles.selectListWrapper}`}>
                    <ul className={styles.selectList}>
                        {options && options.map((option, num) =>
                            <li
                                key={num}
                                className={styles.selectOption}
                                onClick={() => changeOptionHandle(option)}
                            >
                                <div
                                    className={`${styles.checkIcon} ${currentOption === option.name ? styles.checkIcon_active : ''}`}>
                                    {currentOption === option.name ?
                                        <svg width="17" height="12" viewBox="0 0 17 12" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M1.40039 6.30039L4.57922 10.009C5.1234 10.6439 6.09912 10.6633 6.6681 10.0506L14.7004 1.40039"
                                                stroke="#FAFAFA" strokeWidth="2.8" strokeLinecap="round"/>
                                        </svg>
                                        :
                                        ''
                                    }
                                </div>
                                <span
                                    className={styles.optionCaption}
                                >
                                    {option && 'hexCode' in option ?
                                        <div
                                            style={{backgroundColor: option.hexCode}}
                                            className={styles.colorBox}
                                        >

                                        </div>
                                        :
                                        ''
                                    }
                                    {option.caption}
                                </span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </label>
    );
};

export default Select;