import { useState } from 'react';

import { IObject } from '@daybrush/utils';
import EventEmitter from '@scena/event-emitter';

export const useEventBus = () => {
  const [emitter] = useState(new EventEmitter());
  const [eventMap, setEventMap] = useState<IObject<number>>({});

  const requestTrigger = (name: string, params: IObject<any> = {}) => {
    cancelAnimationFrame(eventMap[name] || 0);

    const event = requestAnimationFrame(() => {
      emitter.trigger(name, params);
    });

    setEventMap((events) => ({ ...events, [name]: event }));
  };

  return { emitter, requestTrigger };
};
