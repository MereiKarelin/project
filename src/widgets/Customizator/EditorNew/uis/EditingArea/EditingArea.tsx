import { Dispatch, SetStateAction } from 'react';

import { Viewport } from '@/widgets/Customizator/EditorNew/components/Viewport';

import { ViewMode } from '../../types';
import Toolbar from '../Toolbar';

type PropTypes = {
  viewMode: ViewMode;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
};

export const EditingArea = ({ viewMode, setViewMode }: PropTypes) => {
  return (
    <div className="w-full xs:w-[500px] lg:w-[600px] h-full flex flex-col gap-5">
      <div className="grow w-full bg-[#d9d9d999] rounded-3xl flex flex-col items-center justify-center">
        <Viewport />
      </div>
      <Toolbar viewMode={viewMode} setViewMode={setViewMode} />
    </div>
  );
};
