import React, {useContext, useState} from 'react';
import styles from './LoginForm.module.scss';
import {Context} from "~/root";
import TextInput, {InputType} from "~/shared/UI/TextInput/TextInput";
import {LoginDto} from "~/types/dtos/LoginDto";
import GreenButton from "~/shared/UI/GreenButton/GreenButton";
import {useNavigate} from "react-router";
import {observer} from "mobx-react-lite";

const LoginForm = () => {
    const { rootStore } = useContext(Context);
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submitHandler = async () => {
        const loginDto: LoginDto = new LoginDto(email, password);

        await rootStore.login(loginDto);

        if (!rootStore.isAuth) {
            setError('Неверно указан логин или пароль!')
        } else {
            navigate('/');
        }
    }

    return (
        <div className={styles.formWrapper}>
            <div className={styles.form}>
                <div className={styles.titleBlock}>
                    <h1 className={styles.title}>Добро пожаловать</h1>
                </div>
                <div className={styles.inputs}>
                    <TextInput
                        value={email}
                        setValue={setEmail}
                        placeholder={'Почта'}
                        type={InputType.EMAIL}
                    />
                    <TextInput
                        value={password}
                        setValue={setPassword}
                        placeholder={'Пароль'}
                        type={InputType.PASSWORD}
                    />
                </div>
                <span className={styles.errors}>{error}</span>
                <GreenButton
                    onClick={submitHandler}
                    classNames={styles.submitButton}
                >
                    Войти
                </GreenButton>
            </div>
        </div>
    );
};

export default observer(LoginForm);