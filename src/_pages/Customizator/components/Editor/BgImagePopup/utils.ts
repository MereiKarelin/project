export const getBgImageSrc = (target: HTMLElement) => {
  const imageString = target?.style?.backgroundImage;

  if (!imageString) return;

  const pattern = /url\((.*?)\)/;

  const match = imageString?.match(pattern);

  if (match && match.length > 1) {
    const url = match[1];
    return url.replace(/^['"]|['"]$/g, '').replace(/^[$quot;]$/g, '');
  }
};

export const getDOMBgImageSrc = (target: HTMLElement) => {
  const imageString = target?.style?.backgroundImage;

  if (!imageString) return;

  const pattern = /url\((.*?)\)/;

  const match = imageString?.match(pattern);

  if (match && match.length > 1) {
    const url = match[1];
    return url.replace(/^['"]|['"]$/g, '').replace(/^[$quot;]$/g, '');
  }
};
