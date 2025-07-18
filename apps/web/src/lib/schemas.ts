import {
  GameDifficultyNames,
  HostFormValues,
  JoinFormValues,
  SinglePlayerFormValues,
  UpdateUserDto,
} from '@dribblio/types';
import Joi from 'joi';

export const hostSchema = Joi.object<HostFormValues>({
  isRoundLimit: Joi.boolean().required(),
  config: Joi.object({
    scoreLimit: Joi.number()
      .when('...isRoundLimit', {
        is: false,
        then: Joi.number().required(),
        otherwise: Joi.number().strip(),
      })
      .messages({
        'any.required': 'Score Limit is required when Score Limit mode is selected',
      }),
    roundLimit: Joi.number()
      .when('...isRoundLimit', {
        is: true,
        then: Joi.number().required(),
        otherwise: Joi.number().strip(),
      })
      .messages({
        'any.required': 'Round Limit is required when Round Limit mode is selected',
      }),
    roundTimeLimit: Joi.number().required(),
    gameDifficulty: Joi.string()
      .valid(...GameDifficultyNames)
      .required(),
  }),
});

export const joinSchema = Joi.object<JoinFormValues>({
  roomId: Joi.string().required(),
});

export const updateUserSchema = Joi.object<UpdateUserDto>({
  display_name: Joi.string().optional(),
  name: Joi.string().optional(),
});

export const singlePlayerConfigSchema = Joi.object<SinglePlayerFormValues>({
  hasUnlimitedLives: Joi.boolean().required(),
  gameDifficulty: Joi.string()
    .valid(...GameDifficultyNames)
    .required(),
});
