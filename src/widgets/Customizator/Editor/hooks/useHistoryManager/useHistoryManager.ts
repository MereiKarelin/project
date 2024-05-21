import { useState } from 'react';

import { IObject } from '@daybrush/utils';

import type { ActionType, RestoreCallback } from '@/widgets/Customizator/Editor/types';
type HistoryAction = {
  type: ActionType;
  props: IObject<any>;
};

type Actions = {
  [key in ActionType]: { redo: RestoreCallback; undo: RestoreCallback };
};

export const useHistoryManager = () => {
  const [undoStack, setUndoStack] = useState<HistoryAction[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryAction[]>([]);
  const [types, setTypes] = useState<Actions>({} as Actions);

  const registerType = (type: ActionType, undo: RestoreCallback, redo: RestoreCallback) => {
    setTypes((values) => ({ ...values, [type]: { undo, redo } }));
  };

  const addAction = (type: ActionType, props: IObject<any>) => {
    setUndoStack((values) => [
      ...values,
      {
        type,
        props,
      },
    ]);
    setRedoStack(() => []);
  };

  const undo = () => {
    const undoAction = undoStack.pop();

    if (!undoAction) {
      return;
    }

    setUndoStack(() => undoStack);
    types[undoAction.type].undo(undoAction.props);
    setRedoStack((values) => [...values, undoAction]);
  };

  const redo = () => {
    const redoAction = redoStack.pop();

    if (!redoAction) {
      return;
    }

    setRedoStack(() => redoStack);
    types[redoAction.type].redo(redoAction.props);
    setUndoStack((values) => [...values, redoAction]);
  };

  return { registerType, addAction, undo, redo };
};
