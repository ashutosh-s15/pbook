import { useEffect } from 'react';

export function useBroadcastChannel<T = any>(
  channel: BroadcastChannel,
  handler: (message: T) => void
) {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      handler(event.data as T);
    };

    channel.addEventListener('message', handleMessage);
    return () => {
      channel.removeEventListener('message', handleMessage);
    };
  }, [channel, handler]);
}
