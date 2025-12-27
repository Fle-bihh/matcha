export enum CrossTabEvent {
  EmailVerified = "email-verified",
  EmailChanged = "email-changed",
}

export interface CrossTabEventPayloadMap {
  [CrossTabEvent.EmailVerified]: void;
  [CrossTabEvent.EmailChanged]: string;
}

export interface CrossTabMessage<T extends CrossTabEvent = CrossTabEvent> {
  type: T;
  payload: CrossTabEventPayloadMap[T];
  timestamp: number;
}
