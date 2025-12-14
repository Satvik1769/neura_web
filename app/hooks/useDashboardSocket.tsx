"use client";

import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";
import { deviceApi } from "@/lib/api";

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
      stompClient.subscribe("/topic/dashboard", async (message: IMessage) => {
        const payload = JSON.parse(message.body);
        setData(payload);

        // If payload has device health data, update it via the health endpoint
        if (payload.deviceId && (
          payload.temperature !== undefined ||
          payload.vibration !== undefined ||
          payload.rpm !== undefined ||
          payload.acoustic !== undefined
        )) {
          try {
            await deviceApi.updateDeviceHealth(payload.deviceId, {
              temperature: payload.temperature ?? null,
              vibration: payload.vibration ?? null,
              rpm: payload.rpm ?? null,
              acoustic: payload.acoustic ?? null,
            });
          } catch (error) {
            console.error("Failed to update device health:", error);
          }
        }
      });
    };

    stompClient.activate();
    return () => {
      stompClient.deactivate();
    };
  }, []);

  return data;
}
