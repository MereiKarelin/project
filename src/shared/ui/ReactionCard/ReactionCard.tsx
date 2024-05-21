'use client';
import classNames from 'classnames';
import Image from 'next/image';
import { TouchEvent, useCallback, useEffect, useRef, useState } from 'react';

import { getRelativeBoundingRect } from '@/_pages/Customizator/utils';
import { UserReactionStructure } from '@/entities/Post/model/types';
import { getShortCounterString } from '@/shared/utils';

import { MagnifierWrapper } from '../MagnifierWrapper/MagnifierWrapper';

type PropTypes = {
  reaction: UserReactionStructure;
  handleClick?: () => void;
  isNoPreview?: boolean;
  className?: string;
  iconHeight?: '20' | '24' | '36' | '48';
  prefix?: string;
};

const getReactionId = (reaction: UserReactionStructure, prefix: string) => {
  return `reaction-image-${prefix}-${reaction.reference}`;
};

const touchDuration = 100; // time duration for touch be registered as a picture preview trigger

const ReactionCard = ({
  reaction,
  handleClick,
  className,
  isNoPreview = false,
  iconHeight = '24',
  prefix = '',
}: PropTypes) => {
  const [imageRect, setImageRect] = useState<DOMRect>();
  const [parentRect, setParentRect] = useState<DOMRect>();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const [isLongPress, setIsLongPress] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const id = getReactionId(reaction, `${prefix}-pr`);
    const elem = document?.getElementById(id);
    if (elem) {
      elem.oncontextmenu = function (event) {
        event.preventDefault();
        event.stopPropagation(); // not necessary in my case, could leave in case stopImmediateProp isn't available?
        event.stopImmediatePropagation();
        return false;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayPreview = useCallback(() => {
    const elem = document.getElementById(getReactionId(reaction, prefix));
    const parentElem = elem?.closest('div.post-body.relative') as HTMLElement;

    if (parentElem && elem) {
      const imgRect = getRelativeBoundingRect(
        elem.getBoundingClientRect(),
        parentElem.getBoundingClientRect(),
      );

      const prnRect = getRelativeBoundingRect(
        parentElem.getBoundingClientRect(),
        parentElem.getBoundingClientRect(),
      );

      setIsPreviewOpen(true && !isNoPreview);

      setImageRect(imgRect);
      setParentRect(prnRect);
    }
  }, [prefix, reaction, isNoPreview]);

  const handleTouchStart = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsTouch(true);

      setIsLongPress(false);
      timeout.current = setTimeout(() => {
        setIsLongPress(true);
        displayPreview();
      }, touchDuration);
    },
    [displayPreview],
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsTouch(true);

      if (!isLongPress) {
        //user held the reaction click for time shorter than timeout, i.e. short click
        handleClick?.();
      }
      setIsPreviewOpen(false);
      clearTimeout(timeout.current);
    },
    [isLongPress, handleClick],
  );

  return (
    <>
      <div
        id={getReactionId(reaction, `${prefix}-pr`)}
        className={classNames(
          className,
          'flex flex-row gap-2 items-center text-xs p-2 hover:bg-green-100 h-[46px]',
          reaction.user_reaction ? 'bg-[#AFFFAF]' : '',
        )}
        onMouseEnter={() => {
          if (isTouch) return;
          displayPreview();
        }}
        onClick={() => {
          if (isTouch) return;
          handleClick?.();
        }}
        onMouseLeave={() => {
          if (isTouch) return;
          setIsPreviewOpen(false);
        }}
        onTouchStart={(e) => handleTouchStart(e)}
        onTouchEnd={(e) => handleTouchEnd(e)}
      >
        <div className="flex flex-col justify-center items-center cursor-pointer">
          <div
            id={getReactionId(reaction, prefix)}
            className="w-auto"
            style={{ height: `${iconHeight}px` }}
          >
            <Image
              src={reaction.icon_url}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: 'auto', height: '100%' }}
            />
          </div>
          <span>{reaction.name}</span>
        </div>

        {reaction.total_reactions != 0 ? (
          <span className=" font-bold">{getShortCounterString(reaction.total_reactions)}</span>
        ) : null}
      </div>
      <MagnifierWrapper isOpen={isPreviewOpen} imageRect={imageRect} parentRect={parentRect}>
        <Image
          src={reaction.icon_url}
          alt=""
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: 'auto', height: '100%' }}
        />
      </MagnifierWrapper>
    </>
  );
};

export default ReactionCard;
