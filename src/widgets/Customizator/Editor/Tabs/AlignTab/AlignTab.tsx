import MoveableHelper from 'moveable-helper';
import { RefObject } from 'react';
import Moveable from 'react-moveable';
import MoveableGroup from 'react-moveable/declaration/MoveableGroup';

import { AlignIcon } from '@/widgets/Customizator/Editor/Icons/AlignIcon';
import { HistoryManager, TargetsManager, Tool } from '@/widgets/Customizator/Editor/types';
import { getId, prefix } from '@/widgets/Customizator/Editor/utils';
import { renderFrames } from '@/widgets/Customizator/Editor/utils/MoveableHelper';

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
    const viewportRect = {
      width: 400,
      height: 600,
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
};

export const AlignTab: Tool = {
  id: 'Align',
  type: 'tab',
  icon: () => <AlignIcon />,
  title: 'Align',
  Component: ({ targetsManager, moveableHelper, moveable, historyManager }: PropTypes) => (
    <div className={prefix('align-tab')}>
      {alignDirections.map((direction) =>
        justifyPositions.map((position) => (
          <div
            key={`${direction}-${position}`}
            className={prefix('align', `align-${direction}`, `align-${position}`)}
            onClick={() =>
              onClick(direction, position, targetsManager, moveableHelper, moveable, historyManager)
            }
          >
            <div className={prefix('align-line')} />
            <div className={prefix('align-element1')} />
            <div className={prefix('align-element2')} />
          </div>
        )),
      )}
    </div>
  ),
};
