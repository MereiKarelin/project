import { useState } from 'react';

export const useTargetsManager = () => {
  const [selectedTargets, setSelectedTargets] = useState<(SVGElement | HTMLElement)[]>([]);

  return { selectedTargets, setSelectedTargets };
};
