import { getKey } from 'keycon';
import styled from 'react-css-styled';

import Input from '@/_pages/Customizator/Inputs/Input';
import { IObject, isUndefined } from '@daybrush/utils';

const TextElement = styled('input', '{}');
export default class TextBox extends Input<object, object, HTMLInputElement> {
  protected inputAttributes: IObject<any> = {};
  public render() {
    return (
      <TextElement
        ref={this.input}
        className="relative text-left appearance-none outline-none h-8 w-full font-bold text-xs shadow-[0_0_2px_#000]"
        {...this.inputAttributes}
        {...this.props.inputProps}
        onInput={this.onInput}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
      />
    );
  }
  public getValue(): any {
    return this.getElement().value;
  }
  public setValue(value: any) {
    this.getElement().value = `${isUndefined(value) ? '' : value}`;
  }
  protected onInput = (e: any) => {
    const ev = e.nativeEvent || e;

    if (!isUndefined(ev.data)) {
      return;
    }
    // click (up / down)
    this.props.onChange(this.getElement().value);
  };

  protected onKeyDown = (e: any) => {
    e.stopPropagation();
  };
  protected onKeyUp = (e: any) => {
    const target = e.currentTarget as HTMLInputElement;

    e.stopPropagation();
    if (getKey(e.keyCode) === 'enter') {
      this.props.onChange(target.value);
    }
  };
}
