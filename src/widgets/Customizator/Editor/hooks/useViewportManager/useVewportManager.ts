import { useState } from 'react';

export const useViewportManager = () => {
  const [viewportState, setViewportState] = useState<{
    horizontalGuides: number[];
    verticalGuides: number[];
    zoom: number;
  }>({ horizontalGuides: [], verticalGuides: [], zoom: 1 });

  return { viewportState, setViewportState };
};
