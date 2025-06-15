
import { callHistory } from '@/data/mock';

export type CallHistoryItem = (typeof callHistory)[0];

export type CallState = null | {
  number: string;
  status: 'incoming' | 'active';
  agentId?: string;
  notes?: string;
  startMuted?: boolean;
};
