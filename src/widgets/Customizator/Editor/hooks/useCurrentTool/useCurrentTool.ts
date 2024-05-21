import { useEffect, useState } from 'react';

import { Tool } from '@/widgets/Customizator/Editor/types';

export const useCurrentTool = (initialTool: Tool) => {
  const [selectedTool, setSelectedTool] = useState<Tool>(initialTool);

  const [toolProperties, setToolProperties] = useState<{ [name: string]: any }>({});
  const [selectedGroupTool, setSelectedGroupTool] = useState<Tool | undefined>();

  useEffect(() => {
    if (selectedTool?.id.startsWith('Crop') && selectedTool.toolProperties) {
      const properties: { [name: string]: any } = {};
      selectedTool.toolProperties.forEach((propElement) => {
        for (const [key, value] of Object.entries(propElement)) {
          properties[key] = value;
        }
        setToolProperties((state) => ({ ...state, ...properties }));
      });
    }
  }, [selectedTool]);

  const get = (key: string) => {
    return toolProperties[key];
  };
  const set = (key: string, value: any) => {
    setToolProperties((prev) => ({ ...prev, [key]: value }));
  };

  return {
    selectedTool,
    setSelectedTool,
    selectedGroupTool,
    setSelectedGroupTool,
    toolProperties: { get, set },
  };
};
