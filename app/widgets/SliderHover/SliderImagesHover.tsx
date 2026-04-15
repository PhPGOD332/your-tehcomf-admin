'use client'
import React, { useEffect, useRef, useState } from 'react';
import styles from './SliderImagesHover.module.scss';
import type { Swiper as SwiperType } from 'swiper/react';
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from 'swiper/modules';
import type { IImage } from "~/types/IImage";
import {Link} from "react-router";
import {pagesLinks} from "~/shared/constants";

interface SliderProps {
    widthSlider: number;
    images: IImage[];
}

interface ISlide {
    index: number;
    minX: number;
    maxX: number;
}

const SliderImagesHover = (
    {
        widthSlider,
        images
    }: SliderProps
) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const swiperRef = useRef<SwiperType | null>(null);
    const oneSlideWidth = widthSlider / images.length;
    const [, setSlides] = useState<ISlide[]>([]);
    const [currSlide, setCurrSlide] = useState<number>(0);

    const swiperInit = (swiper: SwiperType) => {
        swiperRef.current = swiper;
    }

    useEffect(() => {
        const swiper = swiperRef.current;
        if (!swiper) return;

        swiper.slideTo(currSlide, 300);
    }, [currSlide]);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;
        const wrapperRect = wrapper.getBoundingClientRect();
        const swiper = swiperRef.current;
        if (!swiper) return;

        const slides: ISlide[] = [];
        let minX = wrapperRect.left;
        let maxX = wrapperRect.left + oneSlideWidth;
        const lastX = wrapperRect.left + wrapper.clientWidth;
        let num = 0;

        for (let i = 0; i < swiper.slides.length; i++) {
            slides.push({
                index: num,
                minX: minX,
                maxX: num === swiper.slides.length - 1 ? lastX : maxX
            });

            num++;
            minX += oneSlideWidth;
            maxX += oneSlideWidth;
        }

        setSlides(slides);

        const mouseEnterHandler = (e: MouseEvent) => {
            const clientX = e.clientX;

            const prevSlide = swiper.activeIndex;
            const newSlide = slides.find(slide => slide.minX <= clientX && slide.maxX >= clientX)?.index ?? 0;

            if (prevSlide !== newSlide)
                setCurrSlide(newSlide);
        }

        const mouseMoveHandler = (e: MouseEvent) => {
            const clientX = e.clientX;

            const prevSlide = swiper.activeIndex;
            const newSlide = slides.find(slide => slide.minX <= clientX && slide.maxX >= clientX)?.index ?? 0;

            if (prevSlide !== newSlide)
                setCurrSlide(newSlide);
        }

        wrapper.addEventListener('mouseenter', mouseEnterHandler);
        wrapper.addEventListener('mousemove', mouseMoveHandler);

        return () => {
            wrapper.removeEventListener('mouseenter', mouseEnterHandler);
            wrapper.removeEventListener('mousemove', mouseMoveHandler);
        }
    }, []);

    return (
        <div
            className={styles.wrapper}
            ref={wrapperRef}
        >
            <Swiper
                onSwiper={swiperInit}
                slidesPerView={1}
                className={styles.slider}
                effect={'fade'}
                modules={[ EffectFade ]}
                speed={600}
                fadeEffect={{
                    crossFade: true
                }}
                breakpoints={{
                    1000: {
                        autoplay: {
                            delay: 5000
                        },

                    }
                }}
            >
                {images.map((image, num) =>
                    <SwiperSlide
                        key={num}
                        className={styles.slide}
                    >
                        <img
                            src={image.src}
                            alt={image.imageAlt ?? ''}
                            className={styles.image}
                        />
                    </SwiperSlide>
                )}
            </Swiper>
        </div>
    );
};

export default SliderImagesHover;