import { Settings } from 'react-slick';
import { ISlide } from './models';

export const slides: ISlide[] = [
  {
    title: 'Развивайся каждый день',
    subtitle: 'Такое мы любим',
  },
  {
    title: 'Создай нечто уникальное',
    subtitle: 'Всё зависит только от тебя!',
  },
  {
    title: 'Делись своим творчеством!',
    subtitle: 'Уверен, им понравится!',
  },
];

export const settings: Settings = {
  dots: false,
  arrows: false,
  speed: 600,
  slidesToShow: 1,
  infinite: false,
  slidesToScroll: 1,
};
