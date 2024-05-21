import classNames from 'classnames';
import { ReactNode } from 'react';

import {
  CropToolCircle,
  CropToolEllipse,
  CropToolPolygon,
  CropToolRect,
} from '@/_pages/Customizator/tools';

import type { Tool, ToolId } from '@/_pages/Customizator/types';
const icons: Partial<{ [id in ToolId]: (selected: boolean) => ReactNode }> = {
  CropRect: (selected = false) => (
    <svg viewBox="0 0 73 73">
      <path
        d="M16.5,21.5 h40 a0,0 0 0 1 0,0 v30 a0,0 0 0 1 -0,0 h-40 a0,0 0 0 1 -0,-0 v-30 a0,0 0 0 1 0,-0 z"
        fill={selected ? '#fff' : '#555'}
        strokeLinejoin="round"
        strokeWidth="3"
        stroke="#fff"
      ></path>
    </svg>
  ),
  CropCircle: (selected = false) => (
    <svg viewBox="0 0 73 73">
      <ellipse
        fill={selected ? '#fff' : '#555'}
        cx="36.5"
        cy="36.5"
        rx="15"
        ry="15"
        strokeLinejoin="round"
        strokeWidth="3"
        stroke="#fff"
      ></ellipse>
    </svg>
  ),
  CropEllipse: (selected = false) => (
    <svg viewBox="0 0 73 73">
      <ellipse
        fill={selected ? '#fff' : '#555'}
        cx="36.5"
        cy="36.5"
        rx="20"
        ry="15"
        strokeLinejoin="round"
        strokeWidth="3"
        stroke="#fff"
      ></ellipse>
    </svg>
  ),
  CropPolygon: (selected = false) => (
    <svg viewBox="0 0 73 73">
      <ellipse
        fill={selected ? '#fff' : '#555'}
        cx="36.5"
        cy="36.5"
        rx="20"
        ry="15"
        strokeLinejoin="round"
        strokeWidth="3"
        stroke="#fff"
      ></ellipse>
    </svg>
  ),
};

type PropTypes = {
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
};

/**
 * It would be better to use single source of truth for tools in tool group,
 * but can not use ToolGroup.tools because of access problems:
 * ReferenceError: Cannot access 'CropToolGroup' before initialization
 */
const subMenu: Tool[] = [CropToolRect, CropToolCircle, CropToolEllipse, CropToolPolygon];

export const SubMenuCrop = ({ selectedTool, setSelectedTool }: PropTypes) => (
  <div className="flex flex-col bg-[#2a2a2a] rounded-sm">
    {subMenu.map((item) => (
      <div
        key={item.id}
        className={classNames(
          'flex flex-row gap-2 m-2 px-2 h-6 items-center rounded-sm',
          selectedTool.id === item.id && 'bg-[#44aaff]',
        )}
        onClick={() => setSelectedTool(item)}
      >
        <div className="w-6 h-6 p-1">{icons[item.id]?.(selectedTool.id === item.id)}</div>
        <span className="text-sm font-bold text-white">{item.title}</span>
      </div>
    ))}
  </div>
);
