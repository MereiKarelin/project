import { MoveableManagerInterface, Renderer } from 'react-moveable';
import { v4 as uuidv4 } from 'uuid';

export interface DeleteButtonViewableProps {
  onClickDelete: () => Promise<(HTMLElement | SVGElement)[]> | undefined;
}
export const DeleteButtonViewable = {
  name: 'deleteButtonViewable',
  props: ['onClickDelete'],
  events: [],
  render(moveable: MoveableManagerInterface<DeleteButtonViewableProps>, React: Renderer) {
    const rect = moveable.getRect();
    const { pos2 } = moveable.state;
    const {
      props: { onClickDelete },
    } = moveable;

    const DeleteButton = moveable.useCSS(
      'div',
      `
        {
            position: absolute;
            left: 0px;
            top: 0px;
            will-change: transform;
            transform-origin: 0px 0px;
            width: 24px;
            height: 24px;
            background: #4af;
            background: var(--moveable-color);
            opacity: 0.9;
            border-radius: 4px;
        }
        :host:before, :host:after {
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
            width: 16px;
            height: 2px;
            background: #fff;
            border-radius: 1px;
            cursor: pointer;
        }
        :host:after {
            transform: translate(-50%, -50%) rotate(-45deg);
        }
        `,
    );
    return (
      <DeleteButton
        key={`delete-btn-${uuidv4()}`}
        className={'moveable-delete-button'}
        onClick={async () => {
          await onClickDelete();
        }}
        style={{
          transform: `translate(${pos2[0]}px, ${pos2[1]}px) rotate(${rect.rotation}deg) translate(10px)`,
        }}
      />
    );
  },
} as const;
