import { parse, stringify } from '@/shared/utils/transform-parse';

const convertTransformsToPercent = (html: string) => {
  const defaultConversion = (v: string) => {
    if (['inherit', 'initial', 'unset'].includes(v)) {
      return v;
    }
    return `calc(var(--viewport-width-scale)*${v})`;
  };

  const pattern = /transform:(.*?);/g;

  let newHtml = html.replace(pattern, function (match) {
    let newTransformString = '';
    if (match) {
      const transformValue = match.slice(10, -1).trim();
      const transformObject = parse(transformValue);

      let convertedString = '';
      if (transformObject.translate) {
        const values = (transformObject.translate as (string | number)[]).map((v) => {
          if (typeof v !== 'number' && !v.toString().endsWith('px')) {
            return defaultConversion(`${v}`);
          }

          return defaultConversion(`${v}px`);
        });
        if (values.length > 1) {
          convertedString = convertedString + `translate(${values[0]}, ${values[1]})`;
        } else {
          convertedString = convertedString + `translate(${values[0]})`;
        }
        delete transformObject.translate;
      }
      newTransformString = stringify(transformObject) + ' ' + convertedString;
    }
    return 'transform: ' + newTransformString + ';';
  });

  const replaceProperty = (
    newHtml: string,
    keyword: string,
    pattern: RegExp,
    conversionFunc: (v: string) => string,
  ) => {
    return newHtml.replace(pattern, (match) => {
      const v = match.slice(keyword.length + 1, -1).trim();
      if (v.endsWith('%')) return match;
      const newString = conversionFunc(v);

      if (keyword === 'font-size') {
        if (['inherit', 'unset', 'initial'].includes(v)) {
          return `${keyword}: ${v};`;
        }
        const newString2 = conversionFunc(`1.5*${v}`);
        return `${keyword}: ${newString}; line-height: ${newString2};`;
      }

      return `${keyword}: ${newString};`;
    });
  };

  newHtml = replaceProperty(newHtml, 'left', /left:(.*?);/g, defaultConversion);
  newHtml = replaceProperty(newHtml, 'top', /top:(.*?);/g, defaultConversion);
  newHtml = replaceProperty(newHtml, 'height', /height:(.*?);/g, defaultConversion);
  newHtml = replaceProperty(newHtml, 'width', /width:(.*?);/g, defaultConversion);

  newHtml = replaceProperty(newHtml, 'font-size', /font-size:(.*?);/g, defaultConversion);

  return newHtml;
};

export const updateTransformOrigin = (html: string) => {
  const pattern = /(?<![\\w-])transform:(.*?);/g;
  const patternOrigin = /(?<![\\w-])transform-origin:(.*?);/g;

  //remove transform-origin properties
  let updatedHtml = html.replace(patternOrigin, function () {
    return '';
  });

  updatedHtml = updatedHtml.replace(pattern, function (match) {
    const transformValue = match.slice(10, -1).trim();
    const transformFunctions = matchTransformFunctions(transformValue);
    const transformObject = Object.fromEntries(
      transformFunctions.map((functionStr) => {
        const [name] = functionStr.split('(');
        return [name, functionStr];
      }),
    );

    if (transformObject.transformOrigin) {
      delete transformObject.transformOrigin;
    }

    if (transformObject.translate) {
      const str = transformObject.translate;
      const args = str.substring(10, str.length - 1).split(',');
      const [x, y] = (args.length > 1 ? args : [args[0], 'px']).map((v) => v.trim());

      //calc(var(--viewport-width-scale)*372px)
      let originX, originY;
      if (x.startsWith('calc')) {
        originX = `${x.substring(0, x.length - 1)} + 50%)`;
      } else {
        originX = `calc(var(--viewport-width-scale)*${x} + 50%)`;
      }

      if (y.startsWith('calc')) {
        originY = `${y.substring(0, y.length - 1)} + 50%)`;
      } else {
        originY = `calc(var(--viewport-width-scale)*${y} + 50%)`;
      }

      const transformOriginString = `${originX} ${originY}`;
      return `${match} transform-origin: ${transformOriginString};`;
    }
    return match;
  });

  return updatedHtml;
};

export const convertDimensionToPercent = (html: string) => {
  const newHtml = convertTransformsToPercent(html);
  return newHtml;
};

/**
 *
 * @param transformString the string content of transform property of style object
 * @returns array of matched strings containing functions defined in transform property
 */
export const matchTransformFunctions = (transformString: string) => {
  //keywords used to define functions in transform propery
  const keywords = [
    'matrix\\(',
    'matrix3d\\(',
    'perspective\\(',
    'rotate\\(',
    'rotate3d\\(',
    'rotateX\\(',
    'rotateY\\(',
    'rotateZ\\(',
    'translate\\(',
    'translate3d\\(',
    'translateX\\(',
    'translateY\\(',
    'translateZ\\(',
    'scale\\(',
    'scale3d\\(',
    'scaleX\\(',
    'scaleY\\(',
    'scaleZ\\(',
    'skew\\(',
    'skewX\\(',
    'skewY\\(',
    'inherit',
    'initial',
    'revert',
    'revert-layer',
    'unset',
  ];

  // Create a regular expression pattern for matching the keywords
  const regexPattern = new RegExp(`(?<![\\w-])(?:${keywords.join('|')})(?<![\\w-])`, 'g');

  // Loop through each keyword and find matches in the input string
  const matches = [];
  let prevIndex = -1;
  let match;
  while ((match = regexPattern.exec(transformString)) !== null) {
    if (prevIndex > -1) {
      matches.push(
        transformString
          .substring(prevIndex, match.index)
          .trim()
          .replace(/^;+|;+$/g, ''),
      );
    }
    prevIndex = match.index;
  }

  if (prevIndex > -1) {
    matches.push(
      transformString
        .substring(prevIndex)
        .trim()
        .replace(/^;+|;+$/g, ''),
    );
  }

  return matches;
};
