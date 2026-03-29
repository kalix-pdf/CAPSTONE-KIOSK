import { useEffect, useRef } from 'react';
import { WEBSOCKET_URL } from "../url.api";

type SocketEvent = {
  event: string;
  data: any;
  timestamp: string;
};

type EventHandlers = {
  [event: string]: (data: any) => void;
};

const WS_URL = WEBSOCKET_URL;

export const useAdminSocket = (handlers: EventHandlers) => {
  const ws = useRef<WebSocket | null>(null);
  const handlersRef = useRef(handlers);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  handlersRef.current = handlers;

  useEffect(() => {
    const connect = () => {
      console.log('Connecting to WebSocket...');
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        console.log('✅ WebSocket connected');
      };

      ws.current.onmessage = (msg) => {
        try {
          const { event, data }: SocketEvent = JSON.parse(msg.data);
          console.log('📨 Received event:', event, data); // ← check if messages arrive
          
          if (handlersRef.current[event]) {
            handlersRef.current[event](data);
          } 
        } catch (err) {
          console.error('Failed to parse WS message:', err);
        }
      };

      ws.current.onerror = (err) => {
        console.error('❌ WebSocket error:', err);
      };

      ws.current.onclose = () => {
        console.log('🔌 Disconnected. Reconnecting in 3s...');
        // Auto-reconnect after 3 seconds
        reconnectTimeout.current = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      reconnectTimeout.current && clearTimeout(reconnectTimeout.current);
      ws.current?.close();
    };
  }, []);
};



// useAdminSocket({
//     ORDER_UPDATED: (updatedOrder) => {
//       setOrders((prev) =>
//         prev
//           .map((o) => (o.order_id === updatedOrder.order_ID ? updatedOrder : o))
//           .filter((o) => o.status !== 2) 
//       );
//       if (updatedOrder.status === 3) {
//         setCompletedToday((prev) => ({ total: (prev?.total ?? 0) + 1 }));
//       }
//     },
//     ORDER_CREATED: (newOrder) => {
//       setOrders((prev) => [newOrder, ...prev]);
//     },
//   });