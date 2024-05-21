// @ts-nocheck
import * as React from 'react';

import { camelize, IObject } from '@daybrush/utils';

import { connectEditorContext } from '../decorators/ConnectEditorContext';
import Editor from '../index.umd';
import { EditorInterface } from '../types';
import Memory from '../utils/Memory';
import { prefix } from '../utils/utils';

export interface Maker {
  tag: string;
  attrs: IObject<any>;
  style: IObject<any>;
}

@connectEditorContext
export default abstract class Icon extends React.PureComponent<{
  selected?: boolean;
  onSelect?: (id: string) => any;
}> {
  public static id: string;
  public static maker?: (memory: Memory) => Maker;
  public static makeThen: (target: HTMLElement | SVGElement) => any = () => {};
  public keys: string[] = [];
  public abstract renderIcon(): any;
  private subContainer = React.createRef<HTMLDivElement>();
  public render() {
    return (
      <div className={prefix('icon', this.props.selected ? 'selected' : '')} onClick={this.onClick}>
        {this.renderIcon()}
        {this.renderSubContainer()}
      </div>
    );
  }
  public renderSubContainer() {
    const subIcons = this.renderSubIcons();

    if (!subIcons.length) {
      return;
    }
    return [
      <div key={'extends-icon'} className={prefix('extends-icon')}></div>,
      this.props.selected && (
        <div
          key={'extends-container'}
          className={prefix('extends-container')}
          ref={this.subContainer}
          onClick={this.onSubClick}
        >
          {subIcons}
        </div>
      ),
    ];
  }
  public renderSubIcons(): any[] {
    return [];
  }
  public renderSubIcon(IconClass: any, id: string, isSelect: boolean) {
    return (
      <div
        key={id}
        className={prefix('icon', 'sub-icon', isSelect ? 'selected' : '')}
        onClick={() => {
          this.onSubSelect(id);
        }}
      >
        <IconClass selected={false} />
        <div className={prefix('sub-icon-label')}>{camelize(` ${id}`)}</div>
      </div>
    );
  }
  public onClick = () => {
    if (this.props.selected) {
      this.focusSub();
    }
    const onSelect = this.props.onSelect;

    if (onSelect) {
      onSelect((this.constructor as any).id);
    }
  };
  public onSubClick = (e: any) => {
    e.stopPropagation();
  };
  public focusSub() {
    const subContainer = this.subContainer.current;
    if (!subContainer) {
      return;
    }

    if (subContainer.style.display === 'block') {
      subContainer.style.display = 'none';
    } else {
      subContainer.style.display = 'block';
    }
  }
  public blur = () => {
    const subContainer = this.subContainer.current;
    if (!subContainer) {
      return;
    }

    subContainer.style.display = 'none';
  };
  public onSubSelect(id: string) {}
  public componentDidMount() {
    const keys = this.keys;
    if (keys.length) {
      this.keyManager.keydown(
        keys,
        (e) => {
          if (e.ctrlKey || e.metaKey) {
            return false;
          }
          this.onClick();
        },
        (this.constructor as any).id,
      );
    }
  }
}

export default interface Icon extends EditorInterface {
  context: Editor;
}
