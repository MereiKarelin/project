import Image from 'next/image';

export const HomeIconsBottom = ({ top = 0 }: { top?: number }) => (
  <div className="relative w-[640px] lg:w-full h-[550px] shrink-0 overflow-hidden scale-75 xs:scale-100">
    <Image
      src="https://cdn.yourbandy.com/public/images/main_page_image_2.png"
      width={143}
      height={143}
      className="absolute left-0 shadow-[0_3px_10px_#818181] rounded-full border-transparent border-3"
      alt="human image"
      style={{ top: `${top + 110}px` }}
    />
    <Image
      src="https://cdn.yourbandy.com/public/images/main_page_image_3.png"
      width={57}
      height={57}
      className="absolute left-[160px] shadow-[0_3px_10px_#818181] rounded-full border-transparent border-3"
      alt="human image"
      style={{ top: `${top + 110}px` }}
    />
    <Image
      src="https://cdn.yourbandy.com/public/images/main_page_image_5.png"
      width={76}
      height={76}
      className="absolute left-[320px] shadow-[0_3px_10px_#818181] rounded-full border-transparent border-3"
      alt="human image"
      style={{ top: `${top + 110}px` }}
    />
    <Image
      src="https://cdn.yourbandy.com/public/images/main_page_image_1.png"
      width={224}
      height={224}
      className="absolute left-[410px] shadow-[0_3px_10px_#818181] rounded-full border-transparent border-3"
      alt="human image"
      style={{ top: `${top + 110}px` }}
    />
    <Image
      src="https://cdn.yourbandy.com/public/images/main_page_image_8.png"
      width={139}
      height={139}
      className="absolute left-[210px] shadow-[0_3px_10px_#818181] rounded-full border-transparent border-3"
      alt="human image"
      style={{ top: `${top + 180}px` }}
    />
    <Image
      src="https://cdn.yourbandy.com/public/images/main_page_image_11.png"
      width={171}
      height={171}
      className="absolute left-[320px] shadow-[0_3px_10px_#818181] rounded-full border-transparent border-3"
      alt="human image"
      style={{ top: `${top + 310}px` }}
    />
    <Image
      src="https://cdn.yourbandy.com/public/images/main_page_image_9.png"
      width={233}
      height={233}
      className="absolute left-[30px] shadow-[0_3px_10px_#818181] rounded-full border-transparent border-3"
      alt="human image"
      style={{ top: `${top + 290}px` }}
    />
  </div>
);
