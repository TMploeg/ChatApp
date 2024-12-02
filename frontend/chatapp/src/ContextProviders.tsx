import { useState } from "react";
import {
  NotificationContext,
  SubscriptionContext,
  Subscription,
  NotificationContextData,
  SubscriptionContextData,
  ChangeHandlerContext,
  ChangeHandlerContextData,
  ChangeHandler,
} from "./context";
import NotificationData from "./models/notification-data";
import StompBroker from "./enums/StompBroker";

interface Props {
  children: any;
  notifications: NotificationData[];
  onSubscribe: <TData>(
    broker: StompBroker,
    callback: (data: TData) => void
  ) => Subscription;
  onNotificationAdded: (notification: NotificationData) => void;
}
export default function ContextProviders({
  children,
  notifications,
  onSubscribe,
  onNotificationAdded,
}: Props) {
  const [changeHandlers, setChangeHandlers] = useState<
    Record<string, Record<string, ChangeHandler>>
  >({});
  const [currentSubscriptionId, setCurrentSubscriptionId] = useState<number>(0);

  return (
    <NotificationContext.Provider value={notificationContextValue()}>
      <SubscriptionContext.Provider value={subscriptionContextValue()}>
        <ChangeHandlerContext.Provider value={changeHandlerContextValue()}>
          {children}
        </ChangeHandlerContext.Provider>
      </SubscriptionContext.Provider>
    </NotificationContext.Provider>
  );

  function notificationContextValue(): NotificationContextData {
    return {
      notifications,
      add: (notification) => onNotificationAdded(notification),
    };
  }

  function subscriptionContextValue(): SubscriptionContextData {
    return {
      subscribe: onSubscribe,
    };
  }

  function changeHandlerContextValue(): ChangeHandlerContextData {
    return {
      onChange: (name, value) => {
        const handlers = changeHandlers[name];
        if (!handlers) {
          return;
        }

        Object.values(handlers).forEach((handler) => handler(value));
      },
      subscribe: (name, handler) => {
        const id = `sub_${name}_${getId()}`;

        setChangeHandlers((handlers) => {
          if (!handlers[name]) {
            handlers[name] = {};
          }

          handlers[name][id] = handler;

          return handlers;
        });

        return {
          unsubscribe: () => {
            setChangeHandlers((handlers) => {
              delete handlers[name][id];
              return handlers;
            });
          },
        };
      },
    };
  }

  function getId(): number {
    const current = currentSubscriptionId;

    setCurrentSubscriptionId((id) => id + 1);

    return current;
  }
}
