'use client';
import { useState } from 'react';

import { IObject } from '@/widgets/Customizator/EditorNew/types';

import type { HistoryAction, HistoryType } from '@/widgets/Customizator/EditorNew/types/managers';
type State = {
  undoStack: HistoryAction[];
  redoStack: HistoryAction[];
  types: Record<
    string,
    {
      redo: (props: IObject<any>, editorState: IObject<any>) => void;
      undo: (props: IObject<any>, editorState: IObject<any>) => void;
    }
  >;
};

export const useHistoryManager = () => {
  const [state, setState] = useState<State>({
    undoStack: [],
    redoStack: [],
    types: {},
  });

  const registerType = (type: HistoryType, redo: () => void, undo: () => void) => {
    setState((state) => ({
      ...state,
      types: { ...state.types, [type]: { undo, redo } },
    }));
  };

  const addAction = (type: HistoryType, props: IObject<any>) => {
    const historyType = state?.types[type];

    if (!historyType) {
      return;
    }

    setState((state) => ({
      ...state,
      undoStack: [
        ...state.undoStack,
        {
          type,
          props,
        },
      ],
      redoStack: [],
    }));
  };

  const undo = (editorState: IObject<any>) => {
    const { undoStack } = state;
    const undoAction = undoStack.pop();

    if (!undoAction) {
      return;
    }
    state.types[undoAction.type].undo(undoAction.props, editorState);
    setState((state) => ({
      ...state,
      undoStack: [...undoStack],
      redoStack: [...state.redoStack, undoAction],
    }));
  };

  const redo = (editorState: IObject<any>) => {
    const { redoStack } = state;
    const redoAction = redoStack.pop();

    if (!redoAction) {
      return;
    }
    state.types[redoAction.type].redo(redoAction.props, editorState);
    setState((state) => ({
      ...state,
      undoStack: [...state.undoStack, redoAction],
      redoStack: [...redoStack],
    }));
  };

  return {
    historyManager: {
      registerType,
      addAction,
      undo,
      redo,
    },
  };
};
