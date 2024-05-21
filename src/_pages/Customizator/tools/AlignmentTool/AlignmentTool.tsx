import classNames from 'classnames';
import MoveableHelper from 'moveable-helper';
import { RefObject } from 'react';
import Moveable from 'react-moveable';
import MoveableGroup from 'react-moveable/declaration/MoveableGroup';

import { AlignIcon } from '@/_pages/Customizator/Icons';
import { getId } from '@/_pages/Customizator/utils';
import { renderFrames } from '@/_pages/Customizator/utils/MoveableHelper';
import { viewportSizes } from '@/shared/consts';

import type { EditorType, HistoryManager, Tab, TargetsManager } from '@/_pages/Customizator/types';
type AlignDirection = 'horizontal' | 'vertical';
type JustifyPosition = 'start' | 'center' | 'end';

const alignDirections: AlignDirection[] = ['vertical', 'horizontal'] as const;
const justifyPositions: JustifyPosition[] = ['start', 'center', 'end'] as const;

function getDirectionPos(
  direction: AlignDirection,
  position: JustifyPosition,
  rect: { left: number; top: number; width: number; height: number },
): number {
  let size: number;
  let start: number;
  if (direction === 'horizontal') {
    size = rect.height;
    start = rect.top;
  } else {
    size = rect.width;
    start = rect.left;
  }
  if (position === 'start') {
    return start;
  }
  if (position === 'center') {
    return start + size / 2;
  }
  return start + size;
}

const onClick = (
  direction: AlignDirection,
  position: JustifyPosition,
  editorType: EditorType,

  targetsManager: TargetsManager,
  moveableHelper: MoveableHelper,
  moveableRef: RefObject<Moveable>,
  historyManager: HistoryManager,
) => {
  const moveable = moveableRef.current;
  if (!moveable) {
    return;
  }
  const moveables = (moveable.moveable as MoveableGroup).moveables;
  const rect = moveable.getRect();
  const pos = getDirectionPos(direction, position, rect);

  if (moveables) {
    // Group
    const infos = moveables
      .map((child) => {
        const target = child.state.target;
        if (!target) return;
        const frame = moveableHelper.getFrame(target);

        if (frame) {
          const prev = frame.get();
          const subRect = child.getRect();
          const subPos = getDirectionPos(direction, position, subRect);
          const delta = pos - subPos;

          const translate = frame
            .get('transform', 'translate')
            .split(',')
            .map((v: string) => parseFloat(v));

          translate[direction === 'horizontal' ? 1 : 0] += delta;

          frame.set('transform', 'translate', translate.map((t: number) => `${t}px`).join(', '));

          return { id: getId(target), prev, next: frame.get() };
        }
        return false;
      })
      .filter((target) => target);

    historyManager?.addAction('renders', {
      infos,
    });
    renderFrames(moveableHelper, targetsManager);
    moveable.updateRect();
  } else {
    const viewportSize = viewportSizes[editorType];
    const viewportRect = {
      ...viewportSize,
      left: 0,
      top: 0,
    };
    const viewportPos = getDirectionPos(direction, position, viewportRect);
    const delta = pos - viewportPos;

    moveable.request(
      'draggable',
      { [direction === 'horizontal' ? 'deltaY' : 'deltaX']: -delta },
      true,
    );
  }
};

type PropTypes = {
  targetsManager: TargetsManager;
  moveableHelper: MoveableHelper;
  moveable: RefObject<Moveable>;
  historyManager: HistoryManager;
  editorType: EditorType;
};

export const AlignmentTool: Tab = {
  id: 'Align',
  type: 'tab',
  title: 'align',
  icon: (selected) => (selected ? <AlignIcon stroke="#fff" /> : <AlignIcon />),
  subMenuWidth: 148,
  Component: ({
    targetsManager,
    moveableHelper,
    moveable,
    historyManager,
    editorType,
  }: PropTypes) => (
    <div className="flex flex-row gap-2">
      {alignDirections.map((direction) =>
        justifyPositions.map((position) => (
          <div
            key={`${direction}-${position}`}
            className={classNames(
              'relative flex flex-row items-center',
              direction === 'horizontal' && 'rotate-90',
              position === 'start' && 'justify-start',
              position === 'center' && 'justify-center',
              position === 'end' && 'justify-end',
            )}
            onClick={() =>
              onClick(
                direction,
                position,
                editorType,
                targetsManager,
                moveableHelper,
                moveable,
                historyManager,
              )
            }
          >
            <div
              className={classNames(
                'absolute flex flex-row',
                position === 'start' && 'items-start',
                position === 'center' && 'items-center',
                position === 'end' && 'items-end',
              )}
            >
              <div className={'w-[1px] h-[18px] bg-[#666]'} />
            </div>
            <div
              className={classNames(
                'flex flex-col gap-[3px]',
                position === 'start' && 'items-start',
                position === 'center' && 'items-center',
                position === 'end' && 'items-end',
              )}
            >
              <div className="w-[10px] h-[5px] bg-[#666666]" />
              <div className="w-[14px] h-[5px] bg-[#666666]" />
            </div>
          </div>
        )),
      )}
    </div>
  ),
};
