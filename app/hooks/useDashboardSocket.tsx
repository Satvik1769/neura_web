"use client";

import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";

export function useDashboardSocket() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000, // auto-reconnect
      debug: () => {}
    });

    stompClient.onConnect = () => {
      stompClient.subscribe("/topic/dashboard", (message: IMessage) => {
        const payload = JSON.parse(message.body);
        setData(payload);
      });
    };

    stompClient.activate();
    return () => {
      stompClient.deactivate();
    };
  }, []);

  return data;
}
