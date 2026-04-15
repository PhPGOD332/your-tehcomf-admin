'use client'
import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from './DragAndDropButton.module.scss';

type TButtonStyle = 'FORM' | 'LIGHT';

interface DraggableButtonProps {
    id?: string;
    formSubmit?: () => void;
    isResetButton: boolean;
    resetTimeout: number;
    buttonStyle: TButtonStyle;
    beforeDragCaption?: string;
    afterDragCaption?: string;
    afterDropCaption?: string;
}

const
    DragAndDropButton = (
    {
        id,
        formSubmit,
        isResetButton = false,
        resetTimeout = 0,
        buttonStyle = 'FORM',
        beforeDragCaption = 'Потяните для отправки',
        afterDragCaption = 'Отпустите',
        afterDropCaption = 'Заявка отправлена!'
    }: DraggableButtonProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragProgress, setDragProgress] = useState(0);
    const [, setMaxX] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const dragContainerRef = useRef<HTMLDivElement | null>(null);
    const dragButtonRef = useRef<HTMLDivElement | null>(null);
    const checkRef = useRef<SVGSVGElement | null>(null);
    const arrowRef = useRef<SVGSVGElement | null>(null);

    const getStyle = (style: TButtonStyle) => {
        let checkStyle: never;

        switch (style) {
            case 'FORM':
                return styles.draggableFormButton;
            case 'LIGHT':
                return styles.draggableLightButton;
            default:
                checkStyle = style;
                return checkStyle;
        }
    }

    const getActiveStyle = (style: string) => {
        switch (style) {
            case 'FORM':
                return styles.draggableFormButton_success;
            case 'LIGHT':
                return styles.draggableLightButton_success;
            default:
                return '';
        }
    }

    const resetButton = () => {
        if (isResetButton) {
             const timeout = setTimeout(() => {
                 setDragProgress(0);
                 setIsDragging(false);
                 setMaxX(0);
                 setIsSubmitted(false);
                 dragContainerRef.current?.classList.remove(getActiveStyle(buttonStyle as string));

                 checkRef.current?.classList.add(styles.hidden);
                 checkRef.current?.classList.remove(styles.visible);

                 arrowRef.current?.classList.add(styles.visible);
                 arrowRef.current?.classList.remove(styles.hidden);
             }, resetTimeout);

            return () => clearTimeout(timeout);
        }
    }

    const handleMove = useCallback((clientX: number) => {
        if (!isDragging || !dragContainerRef.current || !dragButtonRef.current) return;

        const containerRect = dragContainerRef.current?.getBoundingClientRect();
        const buttonRect = dragButtonRef.current?.getBoundingClientRect();

        const maxX = containerRect.width - buttonRect.width;
        const newX = Math.min(Math.max(clientX - containerRect.left - buttonRect.width, 0), maxX);
        setMaxX(maxX);
        setDragProgress((newX / maxX) * 150);
    }, [isDragging])

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!isSubmitted)
            setIsDragging(true);
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        e.stopPropagation();
        if (!isSubmitted)
            setIsDragging(true);
    }

    const handleMouseMove = (e: MouseEvent) => {
        handleMove(e.clientX);
    }

    const handleTouchMove = (e: TouchEvent) => {
        e.stopPropagation();
        if (!e.touches[0]) return;

        handleMove(e.touches[0].clientX);
    }

    const handleMouseUp = () => {
        if (dragProgress >= 80) {
            setIsSubmitted(true);
            setIsDragging(false);
            setDragProgress(100);

            dragContainerRef.current?.classList.add(getActiveStyle(buttonStyle as string));

            arrowRef.current?.classList.add(styles.hidden);
            arrowRef.current?.classList.remove(styles.visible);

            checkRef.current?.classList.add(styles.visible);
            checkRef.current?.classList.remove(styles.hidden);

            if (formSubmit) {
                formSubmit();
            }

            if (isResetButton)
                resetButton();
        } else {
            setDragProgress(0);
            setIsDragging(false);
        }
    }

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);

            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);

            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleMouseUp);
        }

        return  () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);

            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleMouseUp);
        }
    }, [isDragging, dragProgress]);

    return (
        <div className={`no-swiping ${getStyle(buttonStyle) as string}`} ref={dragContainerRef} id={id || ''}>
            <div
                className={styles.draggableWrapper}
                onMouseDown={(e) => handleMouseDown(e)}
                onTouchStart={(e) => handleTouchStart(e)}
                style={{transform: `translateX(${dragProgress * 1.40}px)`}}
            >
                <span className={styles.firstCaption}>{isSubmitted ? afterDropCaption : afterDragCaption}</span>
                <div className={styles.iconButton} ref={dragButtonRef}>
                    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.visible} ref={arrowRef}>
                        <path d="M2 8H19.5" stroke="#58595B" strokeWidth="3" strokeLinecap="round"/>
                        <path d="M20 8L14 2" stroke="#58595B" strokeWidth="3" strokeLinecap="round"/>
                        <path d="M20 8L14 14" stroke="#58595B" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.hidden} ref={checkRef}>
                        <path d="M8 18L18 8" stroke="#00A651" strokeWidth="3" strokeLinecap="round"/>
                        <path d="M8 18L2 12" stroke="#00A651" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                </div>
                <span className={styles.secondCaption}>{beforeDragCaption}</span>
            </div>
        </div>
    );
};

export default DragAndDropButton;