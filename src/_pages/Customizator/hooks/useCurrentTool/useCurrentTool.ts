import { useEffect, useState } from 'react';

import { Tab, Tool, ToolGroup } from '@/_pages/Customizator/types';

export const useCurrentTool = (initialTool: Tool) => {
  const [selectedTool, setSelectedTool] = useState<Tool | Tab>(initialTool);

  const [toolProperties, setToolProperties] = useState<{ [name: string]: any }>({});
  const [selectedToolGroup, setSelectedToolGroup] = useState<ToolGroup | undefined>();

  useEffect(() => {
    if (
      selectedTool.type === 'tool' &&
      selectedTool?.id.startsWith('Crop') &&
      selectedTool.toolProperties
    ) {
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
    selectedToolGroup,
    setSelectedToolGroup,
    toolProperties: { get, set },
  };
};
