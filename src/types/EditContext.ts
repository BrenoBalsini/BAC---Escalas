type LogEntry = {
  status: string;
  details: string;
};

export type EditContext = {
  lifeguardId: string;
  lifeguardName: string;
  day: string;
  preferenceAPostId?: string;
  reasoning: LogEntry | null;
};