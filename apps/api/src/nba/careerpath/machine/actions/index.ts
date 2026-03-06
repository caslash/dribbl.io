import { assignActions } from '@/nba/careerpath/machine/actions/assigns';
import { notifyActions } from '@/nba/careerpath/machine/actions/notifies';

export const actions = {
  ...assignActions,
  ...notifyActions,
};
