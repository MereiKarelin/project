import Image from 'next/image';

export const HomeIconsTop = ({ top = 0 }: { top?: number }) => (
  <div
    className="relative overflow-hidden shrink-0 w-[640px] lg:w-full scale-75 xs:scale-100"
    style={{ height: `${top + 192}px` }}
  >
    <Image
      src="https://cdn.yourbandy.com/public/images/main_page_image_6.png"
      width={167}
      height={167}
      className="absolute left-0 shadow-[0_3px_10px_#818181] rounded-full border-transparent"
      alt="human image"
      style={{ top: `${top - 20}px` }}
    />
    <Image
      src="https://cdn.yourbandy.com/public/images/main_page_image_4.png"
      width={112}
      height={112}
      className="absolute left-[250px] shadow-[0_3px_10px_#818181] rounded-full border-transparent"
      alt="human image"
      style={{ top: `${top - 20}px` }}
    />
    <Image
      src="https://cdn.yourbandy.com/public/images/main_page_image_10.png"
      width={229}
      height={229}
      className="absolute left-[390px] shadow-[0_3px_10px_#818181] rounded-full border-transparent"
      alt="human image"
      style={{ top: `${top - 40}px` }}
    />
    <Image
      src="https://cdn.yourbandy.com/public/images/main_page_image_7.png"
      width={88}
      height={88}
      className="absolute left-[190px] shadow-[0_3px_10px_#818181] rounded-full border-transparent"
      alt="human image"
      style={{ top: `${top + 90}px` }}
    />
    <Image
      src="https://cdn.yourbandy.com/public/images/main_page_image_12.png"
      width={45}
      height={45}
      className="absolute left-[320px] shadow-[0_3px_10px_#818181] rounded-full border-transparent"
      alt="human image"
      style={{ top: `${top + 120}px` }}
    />
  </div>
);
