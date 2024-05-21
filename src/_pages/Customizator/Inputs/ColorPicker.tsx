import { ChromePicker, ColorResult } from 'react-color';

import Input from '@/_pages/Customizator/Inputs/Input';
import { IObject } from '@daybrush/utils';

const AnyChromePicker = ChromePicker as any;

export default class ColorPicker extends Input {
  protected inputAttributes: IObject<any> = {};
  public state = {
    color: 'rgba(255, 255, 255, 255)',
  };
  public render() {
    const color = this.state.color;

    return (
      <AnyChromePicker
        width={'180px'}
        color={color}
        onChange={this.onChange}
        onChangeComplete={this.onChangeComplete}
      />
    );
  }
  public componentDidUpdate() {}
  public setValue(v: string) {
    this.setState({
      color: v,
    });
  }
  public getValue() {
    return this.state.color;
  }
  private onChange = (e: ColorResult) => {
    const { r, g, b, a } = e.rgb;

    this.setState({
      color: `rgba(${r}, ${g}, ${b}, ${a})`,
    });
  };
  private onChangeComplete = (e: ColorResult) => {
    const { r, g, b, a } = e.rgb;

    this.props.onChange(`rgba(${r}, ${g}, ${b}, ${a})`);
  };
}
