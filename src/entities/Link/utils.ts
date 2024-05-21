export const getCaptionElement = (target: HTMLElement) => {
  if (!target) return;

  const linkSpan = target.getElementsByClassName('btn-link-caption')?.[0] as HTMLElement;

  return linkSpan;
};

export const getUrlElement = (target: HTMLElement) => {
  if (!target) return;

  const urlSpan = target.getElementsByClassName('btn-link-url')?.[0] as HTMLElement;

  return urlSpan;
};

export const getIconElement = (target: HTMLElement) => {
  if (!target) return;

  const urlIcon = target.getElementsByClassName('btn-link-icon')?.[0] as HTMLElement;

  return urlIcon;
};

export const getBtnElement = (target: HTMLElement | null | undefined) => {
  if (!target) return;

  const btnElem = target.getElementsByClassName('btn-link')?.[0] as HTMLElement;

  return btnElem;
};
