import { MoveableManagerInterface } from 'react-moveable';

export interface DimensionViewableProps {
  dimensionViewable?: boolean;
}
export const DimensionViewable = {
  name: 'dimensionViewable',
  props: ['dimensionViewable'],
  events: [],
  render(moveable: MoveableManagerInterface<DimensionViewableProps>) {
    const zoom = moveable.props.zoom ?? 1;
    const rect = moveable.getRect();

    return (
      <div
        key={'dimension-viewer'}
        className={'moveable-dimension'}
        style={{
          left: `${rect.width / 2}px`,
          top: `${rect.height}px`,
          transform: `translate(-50%, ${20 * zoom}px) scale(${zoom})`,
        }}
      >
        {Math.round(rect.offsetWidth)} x {Math.round(rect.offsetHeight)}
      </div>
    );
  },
} as const;
