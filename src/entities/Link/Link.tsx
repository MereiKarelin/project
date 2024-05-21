'use client';
import { usePathname } from 'next/navigation';
import { ComponentProps, CSSProperties, useMemo, useState } from 'react';

import { DATA_SCENA_ELEMENT_ID } from '@/_pages/Customizator/consts';
import { CloseButton } from '@/entities/Link/CloseButton';
import { LinkData } from '@/entities/Link/types';
import { useStyle } from '@/entities/Link/useStyle';
import { LinkIcon } from '@/shared/assets/icons';
import { Button } from '@/shared/ui/ButtonNew';
import { isSafeUrl } from '@/shared/utils';
import { IObject } from '@daybrush/utils';

type PropTypes = ComponentProps<'div'> &
  IObject<any> & {
    data: LinkData;
    isPalleteVersion?: boolean;
    isEditable?: boolean;
  };

type ElementVisibility = {
  caption: boolean;
  icon: boolean;
};

export const Link = ({
  data,
  isPalleteVersion = false,
  isEditable = false,
  ...props
}: PropTypes) => {
  const [isRemoveBtnShown, setIsRemoveIconBtnShown] = useState<ElementVisibility>({
    caption: false,
    icon: false,
  });
  const [isShown, setIsShown] = useState<ElementVisibility>({
    caption: true,
    icon: true,
  });

  const pathname = usePathname();

  const linkData =
    data ??
    ({
      caption: { text: 'Куда-то', style: {} },
      linkStyle: {},
      url: 'А где ссылка?',
      isIconEnabled: true,
    } as LinkData);

  const url = linkData.url;
  const isItYourbandyUrl = useMemo(() => isSafeUrl(url), [url]);
  const buttonUrl = isItYourbandyUrl
    ? url
    : `/redirect/${encodeURIComponent(url)}?back=${pathname}`;

  const { btnStyle, width } = useStyle(isEditable, props[DATA_SCENA_ELEMENT_ID]);

  //palette version
  if (isPalleteVersion) {
    return (
      <div
        className="flex flex-row gap-3 bg-white rounded-xl h-28 items-start justify-between p-3 pr-6"
        {...props}
        style={{ ...props.style, position: 'relative' }}
      >
        <Button className="relative flex flex-row gap-3 items-center justify-center rounded-3xl font-bold h-min px-16 py-6 bg-[#78E378] hover:bg-[#63f114] text-white text-2xl whitespace-nowrap flex-grow-0">
          Куда-то
          <LinkIcon />
        </Button>
        <span className="text-black font-bold text-2xl h-full flex flex-row justify-center items-center">
          Ссылка
        </span>
      </div>
    );
  }
  const { style, ...propsRest } = props;
  const styleProp = {
    color: '#fff',
    fontSize: '24px',
    fontWeight: 700,
    ...style,
    borderRadius: style?.borderRadius ?? (width < 100 ? '4px' : '24px'),
    backgroundColor: style?.backgroundColor ?? '#78E378',
  } as CSSProperties;

  if (isEditable) {
    const updatedStyle = {
      ...styleProp,
      backgroundColor:
        !btnStyle?.['backgroundImage'] || btnStyle['backgroundImage'] === 'none'
          ? styleProp?.backgroundColor
          : 'unset',
      borderRadius:
        !styleProp?.borderRadius || styleProp?.borderRadius === 'unset'
          ? width < 100
            ? '4px'
            : '24px'
          : style?.borderRadius,
    };

    //editor version
    return (
      <div
        className="flex flex-col gap-1 items-center justify-center min-w-[10px] min-h-[10px] max-w-[465px] w-[273px] h-[83px]"
        style={{ ...updatedStyle }}
        {...propsRest}
      >
        <div
          className="btn-link relative flex flex-row gap-3 items-center justify-center rounded-3xl font-bold h-full max-w-[465px] bg-cover bg-no-repeat hover:bg-[#63f114] text-white text-2xl whitespace-nowrap flex-grow-0 overflow-hidden w-full"
          style={{
            ...linkData.linkStyle,
            borderRadius: 'inherit',
            backgroundColor: 'inherit',
            fontSize: 'inherit',
            textAlign: 'inherit',
            fontStyle: 'inherit',
            fontWeight: 'inherit',
            textDecoration: 'inherit',
            color: 'inherit',
          }}
        >
          <CloseButton
            handleMouseEnter={() =>
              setIsRemoveIconBtnShown((state) => ({ ...state, caption: true }))
            }
            handleMouseLeave={() =>
              setIsRemoveIconBtnShown((state) => ({ ...state, caption: false }))
            }
            handleRemoveClick={() => setIsShown((state) => ({ ...state, caption: false }))}
            isShown={isShown.caption}
            isRemoveBtnShown={isRemoveBtnShown.caption}
          >
            <span
              contentEditable
              suppressContentEditableWarning
              className="btn-link-caption w-full min-w-[10px] max-w-[290px] overflow-hidden"
              style={linkData.caption.style}
            >
              {linkData.caption?.text}
            </span>
          </CloseButton>
          {linkData.isIconEnabled && (
            <CloseButton
              handleMouseEnter={() =>
                setIsRemoveIconBtnShown((state) => ({ ...state, icon: true }))
              }
              handleMouseLeave={() =>
                setIsRemoveIconBtnShown((state) => ({ ...state, icon: false }))
              }
              handleRemoveClick={() => setIsShown((state) => ({ ...state, icon: false }))}
              isShown={isShown.icon}
              isRemoveBtnShown={isRemoveBtnShown.icon}
            >
              <LinkIcon className="btn-link-icon" />
            </CloseButton>
          )}
        </div>
        <span
          contentEditable
          suppressContentEditableWarning
          className="btn-link-url absolute bottom-[-24px] text-sm font-bold text-[#909090] w-[102px whitespace-nowrap]"
        >
          {linkData.url}
        </span>
      </div>
    );
  }

  //client-side version
  return (
    <div
      className="hover:shadow-[0_3px_10px_#818181]"
      style={{ ...styleProp }}
      {...propsRest}
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        href={buttonUrl}
        className="btn-link relative flex flex-row gap-3 items-center justify-center font-bold h-full max-w-[465px] bg-[#78E378] bg-cover bg-no-repeat hover:bg-[#63f114] text-white text-2xl whitespace-nowrap flex-grow-0 overflow-hidden w-full"
        style={linkData.linkStyle}
      >
        <div
          className="overflow-hidden flex items-center justify-center"
          style={linkData.caption.style}
        >
          {linkData.caption?.text}
        </div>
        {linkData.isIconEnabled && <LinkIcon />}
      </Button>
    </div>
  );
};
