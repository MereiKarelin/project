import KeyController from 'keycon';
import { useCallback, useState } from 'react';

export const useKeyManager = () => {
  const [keyController] = useState(new KeyController());
  const [keys, setKeys] = useState<[string[], string][]>([]);

  const addCallback = useCallback(
    (type: string, keys: string[], callback: (e: any) => any, description?: string) => {
      if (description) {
        setKeys((state) => [...state, [keys, description]]);
      }
      return (e: any) => callback(e);
    },
    [],
  );

  const addKeyDownCallback = useCallback(
    (keys: string[], callback: (e: any) => any, description?: any) => {
      if (description) {
        setKeys((state) => [...state, [keys, description]]);
      }

      keyController.keydown(keys, addCallback('keydown', keys, callback, description));
    },
    [addCallback, keyController],
  );

  const addKeyUpCallback = useCallback(
    (keys: string[], callback: (e: any) => any, description?: any) => {
      keyController.keyup(keys, addCallback('keyup', keys, callback, description));
    },
    [addCallback, keyController],
  );

  return { addKeyDownCallback, addKeyUpCallback, keys, keycon: keyController };
};
