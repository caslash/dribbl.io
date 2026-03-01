import { assignActions } from '@/nba/draft/entities/machine/actions/assigns';
import { notifyActions } from '@/nba/draft/entities/machine/actions/notifies';

export const actions = {
  ...assignActions,
  ...notifyActions,
};
