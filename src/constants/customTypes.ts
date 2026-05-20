export type SelectOption = {
    value: number;
    label: string;
}

export type SseListener = {
  type: string;
  action: (event: MessageEvent) => void;
}