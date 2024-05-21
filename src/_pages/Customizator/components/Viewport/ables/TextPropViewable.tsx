import { MoveableManagerInterface, Renderer } from 'react-moveable';
import { v4 as uuidv4 } from 'uuid';

import { TextIcon } from '@/_pages/Customizator/Icons';

export interface TextPropViewableProps {
  onClickTextProps: () => Promise<(HTMLElement | SVGElement)[]> | undefined;
}
export const TextPropViewable = {
  name: 'textPropViewable',
  props: ['onClickTextProps'],
  events: [],
  render(moveable: MoveableManagerInterface<TextPropViewableProps>, React: Renderer) {
    const rect = moveable.getRect();
    const { pos2 } = moveable.state;
    const {
      props: { onClickTextProps },
    } = moveable;

    return (
      <div
        id="textPropViewableButton"
        key={`props-btn-${uuidv4()}`}
        className="bg-[#4af] w-6 h-6 rounded-[4px] flex items-center justify-center mb-1"
        onClick={async () => {
          await onClickTextProps();
        }}
        style={{
          transform: `translate(${pos2[0]}px, ${pos2[1]}px) rotate(${rect.rotation}deg) translate(10px,28px)`,
        }}
      >
        <TextIcon stroke="#fff" size={20} />
      </div>
    );
  },
} as const;
