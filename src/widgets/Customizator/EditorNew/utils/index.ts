import { toolGroupIds, toolsDesktop, toolsMobile } from '@/widgets/Customizator/EditorNew/consts';
import { Tool } from '@/widgets/Customizator/EditorNew/types';

export const keyboardCommands = () => {
  const combinedArray = [...toolsDesktop, ...toolsMobile];

  const uniqueArray = Array.from(new Set(combinedArray.map((obj) => obj.id)))
    .filter((id) => !toolGroupIds.includes(id))
    .map((id) => combinedArray.find((obj) => obj.id === id)) as Tool[];

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  uniqueArray.sort((a, b) => a.id.localeCompare(b.id));

  return uniqueArray.map((tool) => ({ name: tool?.name, keys: tool?.keys?.join(', ') }));
};

export const getSubMenuPosition = (boundingClientRect: DOMRect, submenuWidth: number) => {
  const left = boundingClientRect.left - 20;
  const right = boundingClientRect.right - 20;
  const width = window.innerWidth - 40;

  const availableWidthFromRight = width - (left + right) / 2;
  const availableWidthFromLeft = (left + right) / 2;

  if (availableWidthFromLeft < submenuWidth && availableWidthFromRight < submenuWidth) {
    //display menu at center of window
    return { direction: 0, offset: width / 2 - submenuWidth / 2 };
  } else if (availableWidthFromRight > submenuWidth) {
    //display menu to the right of item
    return { direction: 1, offset: availableWidthFromLeft };
  }

  //display menu to the left of item
  return { direction: -1, offset: availableWidthFromRight };
};
