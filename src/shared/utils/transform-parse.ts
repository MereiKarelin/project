//credit: https://github.com/praneshr/transform-parse

import { matchTransformFunctions } from '@/shared/utils/html';

export type TransformObject = {
  [key: string]: number | string | (string | number)[] | boolean;
};

// List of transforms for which the value has to be numeral. Default px substitution for these
// transforms will be skipped.
const transformsWithNumeralValues = ['scale', 'scale3d', 'scaleX', 'scaleY', 'scaleZ'];

/**
 * Returns a object representation of the transform string supplied. It parses the string and
 * converts them to an object.
 * @param transformString String containing the transforms
 */
const parse = (transformString: string): TransformObject => {
  const transforms = matchTransformFunctions(transformString);
  // Handle "initial", "inherit", "unset".
  if (transforms.length === 1) {
    return {
      [transforms[0]]: true,
    };
  }

  /**
   * Converts string values to number when the unit is pixel or parsable. Returns a string when the
   * unit is not pixel or not parsable.
   * @param value Value of a transform
   */
  const parsePixelValues = (value: string): string | number => {
    if (value.endsWith('px')) return parseFloat(value);
    if (!Number.isNaN(Number(value))) return Number(value);
    return value;
  };

  return transforms.reduce((acc, transform: string) => {
    if (!transform.length) return acc;

    const transformString = transform.substring(0, transform.length - 1); // remove closing parenthesis
    const [name, transformValue] = transformString.split('(');
    const valueArray = transformValue.split(',');
    const values = valueArray.map((val) => {
      return parsePixelValues(val.endsWith(')') ? val.replace(')', '') : val.trim());
    });
    return {
      ...acc,
      ...{ [name]: values },
    };
  }, {});
};

/**
 * Returns the transform string constructed from the transform object supplied.
 * @param transformObject Object containing the transforms
 */
const stringify = (transformObject: TransformObject): string => {
  const resolveUnits = (key: string, val: number | string): string => {
    if (typeof val === 'number' && !transformsWithNumeralValues.includes(key)) {
      return `${val}px`;
    }
    return val.toString();
  };

  return Object.keys(transformObject)
    .reduce((acc, key) => {
      const value = transformObject[key];
      if (value === true) return key;
      if (value === false) return acc;
      if (Array.isArray(value)) {
        return `${acc} ${key}(${value.map((val) => resolveUnits(key, val)).join(', ')})`;
      }
      return `${acc} ${key}(${resolveUnits(key, value)})`;
    }, '')
    .trim();
};

export { parse, stringify };
