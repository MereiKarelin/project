import { ExpandMenuToolIcon } from '@/widgets/Customizator/EditorNew/uis/icons';

import type { Tool } from '@/widgets/Customizator/EditorNew/types';
export const ExpandMenuTool: Tool = {
  id: 'expandMenu',
  name: 'expand menu',
  icon: (selected) => (selected ? <ExpandMenuToolIcon stroke="#fff" /> : <ExpandMenuToolIcon />),
  className: 'text-white p-1 rounded-3xl',
  // submenuJSX: ({ onClick }) => (
  //   <div className="flex flex-row items-center gap-2">
  //     {toolsExpanding.map((tool) => (
  //       <div
  //         key={tool.id}
  //         onClick={(e) => onClick(e, tool.id)}
  //         className="hover:bg-slate-200 p-1 rounded-md"
  //       >
  //         {tool.icon?.()}
  //       </div>
  //     ))}
  //   </div>
  // ),
  // submenuWidth: 170,
};
