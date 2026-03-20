import { assignActions } from '@/nba/draft/machine/actions/assigns';
import { notifyActions } from '@/nba/draft/machine/actions/notifies';

export const actions = {
  ...assignActions,
  ...notifyActions,
};
