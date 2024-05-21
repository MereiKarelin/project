'use client';

import './HomeMobileSlider.scss';

import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import Slider from 'react-slick';

import Logo from '@/shared/assets/icons/Logo';

import { settings, slides } from '../constants';
import { ISlide } from '../models';

interface ISlideProps {
  slide: ISlide;
  slidesLength: number;
  slideIndex: number;
  handleNextSlide: () => void;
}

const Slide = ({ slide, slidesLength, slideIndex, handleNextSlide }: ISlideProps) => {
  const router = useRouter();

  const closeSlides = () => {
    router.push('/login', { scroll: false });
  };

  const navigateToLogin = () => {
    if (slideIndex === slidesLength - 1) {
      router.push('/login', { scroll: false });
    } else {
      handleNextSlide();
    }
  };

  return (
    <div className="home-mobile-slider__slide">
      <div className="home-mobile-slider__slide-exit">
        <div className="home-mobile-slider__slide-exit-button" onClick={closeSlides}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 7 7"
            fill="none"
          >
            <path d="M1 1L6 6" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M6 1L1 6" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <div className="home-mobile-slider__slide-content">
        <div className="home-mobile-slider__title">{slide.title}</div>
        <div className="home-mobile-slider__subtitle">{slide.subtitle}</div>
        <div className="home-mobile-slider__footer">
          <div className="home-mobile-slider__dots">
            {Array(slidesLength)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className={classNames('home-mobile-slider__dot', {
                    'home-mobile-slider__dot_active': index === slideIndex,
                  })}
                />
              ))}
          </div>
          <div className="home-mobile-slider__button" onClick={navigateToLogin}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
            >
              <path
                d="M1 13L7 7L1 1"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomeMobileSlider = () => {
  const sliderRef = useRef<Slider>(null);

  const handleNextSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  return (
    <div className="home-mobile-slider">
      <div className="home-mobile-slider__splash-screen">
        <Logo />
      </div>
      <Slider className="home-mobile-slider__slider" {...settings} ref={sliderRef}>
        {slides.map((item, index) => (
          <Slide
            slide={item}
            slidesLength={slides.length}
            key={index}
            slideIndex={index}
            handleNextSlide={handleNextSlide}
          />
        ))}
      </Slider>
    </div>
  );
};

export default HomeMobileSlider;
