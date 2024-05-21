import * as React from 'react';

import Input from '@/_pages/Customizator/Inputs/Input';
import { IObject } from '@daybrush/utils';

export default class TabInputBox extends React.PureComponent<{
  onChange: (v: any) => any;
  input: typeof Input;
  label?: string;
  props?: IObject<any>;
  inputProps?: IObject<any>;
  value?: any;
  updateValue?: boolean;
}> {
  public input = React.createRef<Input>();
  public render() {
    const {
      label,
      props = {},
      inputProps = {},
      input: InputType,
      onChange,
      value,
      updateValue,
    } = this.props;

    return (
      <div className="flex flex-col gap-1">
        {label && <h3 className="text-black m-0 text-xs font-bold inline-block">{label}</h3>}

        <InputType
          ref={this.input}
          onChange={onChange}
          {...props}
          inputProps={inputProps}
          value={value}
          updateValue={updateValue}
        ></InputType>
      </div>
    );
  }
  public setValue(v: any) {
    this.input.current?.setValue(v);
  }
  public getValue() {
    return this.input.current?.getValue();
  }
}
