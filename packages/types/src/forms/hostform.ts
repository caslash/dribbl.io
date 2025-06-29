export type HostFormValues = {
  isRoundLimit: boolean;
  config: {
    scoreLimit?: number;
    roundLimit?: number;
    roundTimeLimit: number;
    gameDifficulty: string;
  };
};
