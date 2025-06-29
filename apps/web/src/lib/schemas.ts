import {
  GameDifficultyNames,
  HostFormValues,
  JoinFormValues,
  UpdateUserDto,
} from '@dribblio/types';
import Joi from 'joi';

export const hostSchema = Joi.object<HostFormValues>({
  isRoundLimit: Joi.boolean().required(),
  config: Joi.object({
    scoreLimit: Joi.number().optional(),
    roundLimit: Joi.number().optional(),
    roundTimeLimit: Joi.number().required(),
    gameDifficulty: Joi.string()
      .valid(...GameDifficultyNames)
      .required(),
  }),
}).custom((value, helpers) => {
  const { isRoundLimit, config } = value;
  if (isRoundLimit && !config.roundLimit) {
    return helpers.error('any.custom', {
      message: 'Round Limit is required when Round Limit mode is selected',
    });
  }
  if (!isRoundLimit && !config.scoreLimit) {
    return helpers.error('any.custom', {
      message: 'Score Limit is required when Score Limit mode is selected',
    });
  }
  return value;
}, 'Round/Score limit conditional check');

export const joinSchema = Joi.object<JoinFormValues>({
  roomId: Joi.string().required(),
});

export const updateUserSchema = Joi.object<UpdateUserDto>({
  display_name: Joi.string().optional(),
  name: Joi.string().optional(),
});
