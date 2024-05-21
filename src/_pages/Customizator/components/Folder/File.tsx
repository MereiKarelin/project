import { PureComponent } from 'react';

export default class File<T = object> extends PureComponent<
  {
    name: string;
    scope: string[];
    fullId: string;
    value: any;
  } & T
> {}
