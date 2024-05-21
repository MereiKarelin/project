import MoveableHelper from 'moveable-helper';
import { RefObject, useCallback } from 'react';
import Moveable from 'react-moveable';

import { Viewport } from '@/widgets/Customizator/Editor/components';
import { FontIcon } from '@/widgets/Customizator/Editor/Icons/FontIcon';
import SelectBox from '@/widgets/Customizator/Editor/Inputs/SelectBox';
import TabInputBox from '@/widgets/Customizator/Editor/Inputs/TabInputBox';
import TextBox from '@/widgets/Customizator/Editor/Inputs/TextBox';
import {
  EventBus,
  HistoryManager,
  TargetsManager,
  Tool,
  ToolManager,
} from '@/widgets/Customizator/Editor/types';
import { prefix, setProperty } from '@/widgets/Customizator/Editor/utils';
import { getProperties } from '@/widgets/Customizator/Editor/utils/MoveableHelper';

const FONT_FAMILY_PROPS = {
  options: ['sans-serif'],
};
const TEXT_ALIGN_PROPS = {
  options: ['left', 'center', 'right', 'justify'],
};
const FONT_STYLE_PROPS = {
  options: ['normal', 'italic', 'blique'],
};
const FONT_WEIGHT_PROPS = {
  options: ['100', '200', '300', 'normal', '500', '600', 'bold', '800'],
};
const TEXT_DECORATION_PROPS = {
  options: ['none', 'underline', 'overline', 'line-through'],
};

const handleChangeSize = (v: any, changeProperty: (key: string, v: any) => void) => {
  changeProperty('font-size', v);
};
const handleChangeAlign = (v: any, changeProperty: (key: string, v: any) => void) => {
  changeProperty('text-align', v);
};
const handleChangeFamily = (v: any, changeProperty: (key: string, v: any) => void) => {
  changeProperty('font-family', v);
};
const handleChangeStyle = (v: any, changeProperty: (key: string, v: any) => void) => {
  changeProperty('font-style', v);
};
const handleChangeWeight = (v: any, changeProperty: (key: string, v: any) => void) => {
  changeProperty('font-weight', v);
};
const handleChangeDecoration = (v: any, changeProperty: (key: string, v: any) => void) => {
  changeProperty('text-decoration', v);
};

type PropTypes = {
  targetsManager: TargetsManager;
  moveableHelper: MoveableHelper;
  viewportRef: RefObject<Viewport>;
  moveable: RefObject<Moveable>;
  toolManager: ToolManager;
  eventBus: EventBus;
  historyManager: HistoryManager;
};

export const FontTab: Tool = {
  id: 'Font',
  type: 'tab',
  icon: () => <FontIcon />,
  title: 'Font',
  Component: ({
    targetsManager,
    moveableHelper,
    viewportRef,
    moveable,
    toolManager,
    eventBus,
    historyManager,
  }: PropTypes) => {
    const [family, size, align, style, weight, decoration] = getProperties(
      [
        ['font-family'],
        ['font-size'],
        ['text-align'],
        ['font-style'],
        ['font-weight'],
        ['text-decoration'],
      ],
      ['sans-serif', '14px', 'left', 'normal', 'normal', 'none'],
      moveableHelper,
      targetsManager,
      toolManager,
    );

    const changeProperty = useCallback(
      (key: string, v: any) => {
        toolManager.toolProperties.set(key, v);
        setProperty(
          [key],
          v,
          viewportRef,
          moveable,
          targetsManager,
          moveableHelper,
          eventBus,
          historyManager,
          true,
        );
      },
      [
        toolManager,
        viewportRef,
        moveable,
        targetsManager,
        moveableHelper,
        eventBus,
        historyManager,
      ],
    );

    return (
      <div className={prefix('font-tab')}>
        <TabInputBox
          type={'half'}
          label="family"
          input={SelectBox}
          props={FONT_FAMILY_PROPS}
          value={family}
          updateValue={true}
          onChange={(v: any) => handleChangeFamily(v, changeProperty)}
        />
        <TabInputBox
          type={'half'}
          label="size"
          input={TextBox}
          value={size}
          updateValue={true}
          onChange={(v: any) => handleChangeSize(v, changeProperty)}
        />
        <TabInputBox
          type={'half'}
          label="align"
          input={SelectBox}
          props={TEXT_ALIGN_PROPS}
          value={align}
          updateValue={true}
          onChange={(v: any) => handleChangeAlign(v, changeProperty)}
        />
        <TabInputBox
          type={'half'}
          label="style"
          input={SelectBox}
          props={FONT_STYLE_PROPS}
          value={style}
          updateValue={true}
          onChange={(v: any) => handleChangeStyle(v, changeProperty)}
        />
        <TabInputBox
          type={'half'}
          label="weight"
          input={SelectBox}
          props={FONT_WEIGHT_PROPS}
          value={weight}
          updateValue={true}
          onChange={(v: any) => handleChangeWeight(v, changeProperty)}
        />
        <TabInputBox
          type={'half'}
          label="decoration"
          input={SelectBox}
          props={TEXT_DECORATION_PROPS}
          value={decoration}
          updateValue={true}
          onChange={(v: any) => handleChangeDecoration(v, changeProperty)}
        />
      </div>
    );
  },
};
