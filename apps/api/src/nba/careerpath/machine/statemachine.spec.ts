import type { CareerPathContext } from '@dribblio/types';
import { GameDifficulties, Player } from '@dribblio/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { waitFor } from 'xstate';
import { guards } from './guards';
import { createCareerPathMachine } from './statemachine';

// Mock the socket actor so the machine doesn't need a real socket.io server
vi.mock('@/nba/careerpath/machine/actors/websocket', async () => {
  const { fromCallback } = await import('xstate');
  return {
    socketActor: fromCallback<any, any>(() => () => {}),
  };
});

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

const mockPlayer = (id: number): Player =>
  ({
    playerId: id,
    firstName: 'Test',
    lastName: `Player${id}`,
    fullName: `Test Player${id}`,
    isActive: true,
    birthdate: null,
    school: null,
    country: null,
    height: null,
    weightLbs: null,
    position: null,
    jerseyNumber: null,
    teamId: null,
    draftYear: null,
    draftRound: null,
    draftNumber: null,
    fromYear: null,
    toYear: null,
    greatest75Flag: false,
    updatedAt: new Date(),
    seasons: [],
    accolades: [],
    team: null,
  }) as Player;

const makeContext = (
  overrides: Partial<CareerPathContext> = {},
): CareerPathContext => ({
  config: { lives: undefined, gameDifficulty: GameDifficulties.allPlayers },
  gameState: { score: 0, validAnswers: [], lives: undefined },
  ...overrides,
});

// Minimal guard args shape that XState guards expect
const makeGuardArgs = (context: CareerPathContext, event: any) => ({
  context,
  event,
  self: {} as any,
  system: {} as any,
});

const validPlayers = [mockPlayer(1), mockPlayer(2)];
const mockGenerateRound = vi
  .fn()
  .mockResolvedValue({ validAnswers: validPlayers });
const mockSocketInfo = { io: {} as any, roomId: 'test-room' };
const WAIT_TIMEOUT = { timeout: 2000 };

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------

describe('guards', () => {
  describe('isCorrect', () => {
    it('should return true when the guessed player id matches a valid answer', () => {
      const context = makeContext({
        gameState: {
          score: 0,
          lives: undefined,
          validAnswers: [mockPlayer(1), mockPlayer(2)],
        },
      });
      const event = { type: 'USER_GUESS' as const, guess: { guessId: 1 } };
      expect(guards.isCorrect(makeGuardArgs(context, event) as any)).toBe(true);
    });

    it('should return false when the guessed player id does not match any valid answer', () => {
      const context = makeContext({
        gameState: {
          score: 0,
          lives: undefined,
          validAnswers: [mockPlayer(1), mockPlayer(2)],
        },
      });
      const event = { type: 'USER_GUESS' as const, guess: { guessId: 999 } };
      expect(guards.isCorrect(makeGuardArgs(context, event) as any)).toBe(
        false,
      );
    });

    it('should return false when validAnswers is empty', () => {
      const context = makeContext();
      const event = { type: 'USER_GUESS' as const, guess: { guessId: 1 } };
      expect(guards.isCorrect(makeGuardArgs(context, event) as any)).toBe(
        false,
      );
    });
  });

  describe('hasLives', () => {
    it('should return true when lives is undefined (unlimited lives mode)', () => {
      const context = makeContext({
        gameState: { score: 0, validAnswers: [], lives: undefined },
      });
      expect(
        guards.hasLives(makeGuardArgs(context, { type: 'SKIP' }) as any),
      ).toBe(true);
    });

    it('should return true when lives is greater than 0', () => {
      const context = makeContext({
        gameState: { score: 0, validAnswers: [], lives: 3 },
      });
      expect(
        guards.hasLives(makeGuardArgs(context, { type: 'SKIP' }) as any),
      ).toBe(true);
    });

    it('should return false when lives is 0', () => {
      const context = makeContext({
        gameState: { score: 0, validAnswers: [], lives: 0 },
      });
      expect(
        guards.hasLives(makeGuardArgs(context, { type: 'SKIP' }) as any),
      ).toBe(false);
    });
  });

  describe('configSet', () => {
    it('should return true when gameDifficulty is set', () => {
      const context = makeContext();
      expect(
        guards.configSet(makeGuardArgs(context, { type: 'START_GAME' }) as any),
      ).toBe(true);
    });

    it('should return false when gameDifficulty is falsy', () => {
      const context = makeContext({
        config: { lives: undefined, gameDifficulty: undefined as any },
      });
      expect(
        guards.configSet(makeGuardArgs(context, { type: 'START_GAME' }) as any),
      ).toBe(false);
    });
  });
});

// ---------------------------------------------------------------------------
// State machine
// ---------------------------------------------------------------------------

describe('createCareerPathMachine', () => {
  type Actor = ReturnType<typeof createCareerPathMachine>;
  let actor: Actor;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGenerateRound.mockResolvedValue({ validAnswers: validPlayers });
    actor = createCareerPathMachine(mockSocketInfo, mockGenerateRound);
  });

  afterEach(() => {
    actor.stop();
  });

  // -------------------------------------------------------------------------
  // Initial state
  // -------------------------------------------------------------------------

  it('should start in the waitingForGameStart state', () => {
    expect(actor.getSnapshot().value).toBe('waitingForGameStart');
  });

  it('should initialise game state via assignGameStart on entry', () => {
    const { context } = actor.getSnapshot();
    expect(context.gameState.score).toBe(0);
    expect(context.gameState.validAnswers).toEqual([]);
    // assignGameStart copies config.lives → gameState.lives. Default config has lives: undefined.
    expect(context.gameState.lives).toBeUndefined();
  });

  it('should transition to the closed final state on PLAYER_DISCONNECTED', () => {
    actor.send({ type: 'PLAYER_DISCONNECTED' });
    expect(actor.getSnapshot().value).toBe('closed');
  });

  // -------------------------------------------------------------------------
  // SAVE_CONFIG / assignConfig
  // -------------------------------------------------------------------------

  describe('SAVE_CONFIG', () => {
    it('should remain in waitingForGameStart after saving config', () => {
      actor.send({
        type: 'SAVE_CONFIG',
        config: { gameDifficulty: 'allplayers', lives: 3 },
      });
      expect(actor.getSnapshot().value).toBe('waitingForGameStart');
    });

    it('should update config.lives and config.gameDifficulty via assignConfig', () => {
      actor.send({
        type: 'SAVE_CONFIG',
        config: { gameDifficulty: 'greatest75', lives: 3 },
      });
      const { config } = actor.getSnapshot().context;
      expect(config.lives).toBe(3);
      expect(config.gameDifficulty).toEqual(GameDifficulties.greatest75);
    });

    it('should map all known difficulty names correctly', () => {
      const cases = [
        { name: 'firstallnba', expected: GameDifficulties.firstAllNBA },
        { name: 'allnba', expected: GameDifficulties.allNBA },
        { name: 'greatest75', expected: GameDifficulties.greatest75 },
        { name: 'allplayers', expected: GameDifficulties.allPlayers },
      ];

      for (const { name, expected } of cases) {
        actor.send({
          type: 'SAVE_CONFIG',
          config: { gameDifficulty: name, lives: undefined },
        });
        expect(actor.getSnapshot().context.config.gameDifficulty).toEqual(
          expected,
        );
      }
    });

    it('should default to greatest75 for an unrecognised difficulty name', () => {
      actor.send({
        type: 'SAVE_CONFIG',
        config: { gameDifficulty: 'unknown', lives: undefined },
      });
      expect(actor.getSnapshot().context.config.gameDifficulty).toEqual(
        GameDifficulties.greatest75,
      );
    });

    it('should apply config.lives to gameState.lives when the game starts', async () => {
      actor.send({
        type: 'SAVE_CONFIG',
        config: { gameDifficulty: 'allplayers', lives: 3 },
      });
      actor.send({ type: 'START_GAME' });
      await waitFor(
        actor,
        (s) => s.matches({ gameActive: 'waitingForGuess' }),
        WAIT_TIMEOUT,
      );
      expect(actor.getSnapshot().context.gameState.lives).toBe(3);
    });
  });

  // -------------------------------------------------------------------------
  // Game start / round generation
  // -------------------------------------------------------------------------

  describe('START_GAME', () => {
    it('should enter gameActive.generatingRound immediately on START_GAME', () => {
      actor.send({ type: 'START_GAME' });
      expect(
        actor.getSnapshot().matches({ gameActive: 'generatingRound' }),
      ).toBe(true);
    });

    it('should transition to gameActive.waitingForGuess after the round is generated', async () => {
      actor.send({ type: 'START_GAME' });
      await waitFor(
        actor,
        (s) => s.matches({ gameActive: 'waitingForGuess' }),
        WAIT_TIMEOUT,
      );
      expect(
        actor.getSnapshot().matches({ gameActive: 'waitingForGuess' }),
      ).toBe(true);
    });

    it('should populate validAnswers via assignRoundGenerated once the actor resolves', async () => {
      actor.send({ type: 'START_GAME' });
      await waitFor(
        actor,
        (s) => s.matches({ gameActive: 'waitingForGuess' }),
        WAIT_TIMEOUT,
      );
      expect(actor.getSnapshot().context.gameState.validAnswers).toEqual(
        validPlayers,
      );
    });

    it('should call generateRound with the configured difficulty', async () => {
      actor.send({
        type: 'SAVE_CONFIG',
        config: { gameDifficulty: 'greatest75', lives: undefined },
      });
      actor.send({ type: 'START_GAME' });
      await waitFor(
        actor,
        (s) => s.matches({ gameActive: 'waitingForGuess' }),
        WAIT_TIMEOUT,
      );
      expect(mockGenerateRound).toHaveBeenCalledWith(
        GameDifficulties.greatest75,
      );
    });
  });

  // -------------------------------------------------------------------------
  // Correct guess / assignCorrectGuess
  // -------------------------------------------------------------------------

  describe('correct guess', () => {
    beforeEach(async () => {
      actor.send({ type: 'START_GAME' });
      await waitFor(
        actor,
        (s) => s.matches({ gameActive: 'waitingForGuess' }),
        WAIT_TIMEOUT,
      );
    });

    it('should increment the score via assignCorrectGuess', async () => {
      actor.send({
        type: 'USER_GUESS',
        guess: { guessId: validPlayers[0].playerId },
      });
      await waitFor(
        actor,
        (s) => s.matches({ gameActive: 'waitingForGuess' }),
        WAIT_TIMEOUT,
      );
      expect(actor.getSnapshot().context.gameState.score).toBe(1);
    });

    it('should generate a new round after a correct guess', async () => {
      actor.send({
        type: 'USER_GUESS',
        guess: { guessId: validPlayers[0].playerId },
      });
      await waitFor(
        actor,
        (s) => s.matches({ gameActive: 'waitingForGuess' }),
        WAIT_TIMEOUT,
      );
      expect(mockGenerateRound).toHaveBeenCalledTimes(2);
    });

    it('should accumulate score across multiple correct guesses', async () => {
      actor.send({
        type: 'USER_GUESS',
        guess: { guessId: validPlayers[0].playerId },
      });
      await waitFor(
        actor,
        (s) => s.matches({ gameActive: 'waitingForGuess' }),
        WAIT_TIMEOUT,
      );

      actor.send({
        type: 'USER_GUESS',
        guess: { guessId: validPlayers[0].playerId },
      });
      await waitFor(
        actor,
        (s) =>
          s.matches({ gameActive: 'waitingForGuess' }) &&
          s.context.gameState.score === 2,
        WAIT_TIMEOUT,
      );
      expect(actor.getSnapshot().context.gameState.score).toBe(2);
    });
  });

  // -------------------------------------------------------------------------
  // Incorrect guess / assignIncorrectGuess
  // -------------------------------------------------------------------------

  describe('incorrect guess', () => {
    beforeEach(async () => {
      actor.send({ type: 'START_GAME' });
      await waitFor(
        actor,
        (s) => s.matches({ gameActive: 'waitingForGuess' }),
        WAIT_TIMEOUT,
      );
    });

    it('should remain in waitingForGuess when hasLives returns true (unlimited lives)', () => {
      actor.send({ type: 'USER_GUESS', guess: { guessId: 999 } });
      expect(
        actor.getSnapshot().matches({ gameActive: 'waitingForGuess' }),
      ).toBe(true);
    });

    it('should not modify lives when lives is undefined via assignIncorrectGuess', () => {
      actor.send({ type: 'USER_GUESS', guess: { guessId: 999 } });
      expect(actor.getSnapshot().context.gameState.lives).toBeUndefined();
    });

    it('should reset score to 0 on an incorrect guess in infinite mode', async () => {
      // Build up a score first
      actor.send({
        type: 'USER_GUESS',
        guess: { guessId: validPlayers[0].playerId },
      });
      await waitFor(
        actor,
        (s) => s.matches({ gameActive: 'waitingForGuess' }),
        WAIT_TIMEOUT,
      );
      expect(actor.getSnapshot().context.gameState.score).toBe(1);

      // Incorrect guess should reset score to 0 in infinite mode
      actor.send({ type: 'USER_GUESS', guess: { guessId: 999 } });
      expect(actor.getSnapshot().context.gameState.score).toBe(0);
    });

    it('should not generate a new round after an incorrect guess', () => {
      actor.send({ type: 'USER_GUESS', guess: { guessId: 999 } });
      expect(mockGenerateRound).toHaveBeenCalledTimes(1);
    });
  });

  describe('incorrect guess (limited lives)', () => {
    beforeEach(async () => {
      actor.send({
        type: 'SAVE_CONFIG',
        config: { gameDifficulty: 'allplayers', lives: 2 },
      });
      actor.send({ type: 'START_GAME' });
      await waitFor(
        actor,
        (s) => s.matches({ gameActive: 'waitingForGuess' }),
        WAIT_TIMEOUT,
      );
    });

    it('should initialise gameState.lives from config.lives at game start', () => {
      expect(actor.getSnapshot().context.gameState.lives).toBe(2);
    });

    it('should decrement lives on incorrect guess via assignIncorrectGuess', () => {
      actor.send({ type: 'USER_GUESS', guess: { guessId: 999 } });
      expect(actor.getSnapshot().context.gameState.lives).toBe(1);
    });

    it('should transition to waitingForGameStart when lives reach 0', () => {
      // hasLives checks lives > 1 (pre-decrement), so with lives=2:
      // guess 1 passes (2 > 1), guess 2 fails (1 > 1) → gameOver directly.
      actor.send({ type: 'USER_GUESS', guess: { guessId: 999 } }); // hasLives(2)=true → lives=1
      actor.send({ type: 'USER_GUESS', guess: { guessId: 999 } }); // hasLives(1)=false → gameOver, lives=0
      expect(actor.getSnapshot().value).toBe('waitingForGameStart');
    });

    it('should reset score to 0 and restore lives from config when starting a new game after game over', async () => {
      actor.send({
        type: 'USER_GUESS',
        guess: { guessId: validPlayers[0].playerId },
      }); // score: 1
      await waitFor(
        actor,
        (s) => s.matches({ gameActive: 'waitingForGuess' }),
        WAIT_TIMEOUT,
      );

      actor.send({ type: 'USER_GUESS', guess: { guessId: 999 } }); // hasLives(2)=true → lives=1
      actor.send({ type: 'USER_GUESS', guess: { guessId: 999 } }); // hasLives(1)=false → gameOver, lives=0
      expect(actor.getSnapshot().value).toBe('waitingForGameStart');

      // assignGameStart runs on gameActive entry — reset happens on next START_GAME, not on game over.
      actor.send({ type: 'START_GAME' });
      await waitFor(
        actor,
        (s) => s.matches({ gameActive: 'waitingForGuess' }),
        WAIT_TIMEOUT,
      );
      expect(actor.getSnapshot().context.gameState.score).toBe(0);
      expect(actor.getSnapshot().context.gameState.lives).toBe(2);
    });
  });

  // -------------------------------------------------------------------------
  // Skip round / assignSkipRound
  // -------------------------------------------------------------------------

  describe('skip round', () => {
    describe('unlimited lives (default)', () => {
      beforeEach(async () => {
        actor.send({ type: 'START_GAME' });
        await waitFor(
          actor,
          (s) => s.matches({ gameActive: 'waitingForGuess' }),
          WAIT_TIMEOUT,
        );
      });

      it('should generate a new round after skipping', async () => {
        actor.send({ type: 'SKIP' });
        await waitFor(
          actor,
          (s) => s.matches({ gameActive: 'waitingForGuess' }),
          WAIT_TIMEOUT,
        );
        expect(mockGenerateRound).toHaveBeenCalledTimes(2);
      });

      it('should not modify lives when lives is undefined', async () => {
        actor.send({ type: 'SKIP' });
        await waitFor(
          actor,
          (s) => s.matches({ gameActive: 'waitingForGuess' }),
          WAIT_TIMEOUT,
        );
        expect(actor.getSnapshot().context.gameState.lives).toBeUndefined();
      });

      it('should reset score to 0 via assignSkipRound when config.lives is undefined', async () => {
        actor.send({
          type: 'USER_GUESS',
          guess: { guessId: validPlayers[0].playerId },
        });
        await waitFor(
          actor,
          (s) => s.matches({ gameActive: 'waitingForGuess' }),
          WAIT_TIMEOUT,
        );
        expect(actor.getSnapshot().context.gameState.score).toBe(1);

        actor.send({ type: 'SKIP' });
        await waitFor(
          actor,
          (s) =>
            s.matches({ gameActive: 'waitingForGuess' }) &&
            s.context.gameState.score === 0,
          WAIT_TIMEOUT,
        );
        expect(actor.getSnapshot().context.gameState.score).toBe(0);
      });
    });

    describe('with config.lives set', () => {
      // SAVE_CONFIG must happen in waitingForGameStart (before START_GAME), as gameActive has no handler.
      beforeEach(async () => {
        actor.send({
          type: 'SAVE_CONFIG',
          config: { gameDifficulty: 'allplayers', lives: 2 },
        });
        actor.send({ type: 'START_GAME' });
        await waitFor(
          actor,
          (s) => s.matches({ gameActive: 'waitingForGuess' }),
          WAIT_TIMEOUT,
        );
      });

      it('should preserve score on skip when config.lives is set via assignSkipRound', async () => {
        actor.send({
          type: 'USER_GUESS',
          guess: { guessId: validPlayers[0].playerId },
        }); // score: 1
        await waitFor(
          actor,
          (s) => s.matches({ gameActive: 'waitingForGuess' }),
          WAIT_TIMEOUT,
        );
        expect(actor.getSnapshot().context.gameState.score).toBe(1);

        actor.send({ type: 'SKIP' });
        await waitFor(
          actor,
          (s) => s.matches({ gameActive: 'waitingForGuess' }),
          WAIT_TIMEOUT,
        );
        expect(actor.getSnapshot().context.gameState.score).toBe(1);
      });

      it('should decrement lives on skip via assignSkipRound', async () => {
        actor.send({ type: 'SKIP' });
        await waitFor(
          actor,
          (s) => s.matches({ gameActive: 'waitingForGuess' }),
          WAIT_TIMEOUT,
        );
        expect(actor.getSnapshot().context.gameState.lives).toBe(1);
      });

      it('should transition to waitingForGameStart when lives are exhausted by skipping', async () => {
        // hasLives checks lives > 1 (pre-decrement), so with lives=2:
        // skip 1 passes (2 > 1), skip 2 fails (1 > 1) → gameOver directly.
        actor.send({ type: 'SKIP' }); // hasLives(2)=true → assignSkipRound(lives=1), generatingRound
        await waitFor(
          actor,
          (s) => s.matches({ gameActive: 'waitingForGuess' }),
          WAIT_TIMEOUT,
        );
        actor.send({ type: 'SKIP' }); // hasLives(1)=false → assignSkipRound(lives=0), gameOver → waitingForGameStart
        expect(actor.getSnapshot().value).toBe('waitingForGameStart');
      });
    });
  });

  // -------------------------------------------------------------------------
  // PLAYER_DISCONNECTED while game is active
  // -------------------------------------------------------------------------

  it('should transition to closed from within gameActive on PLAYER_DISCONNECTED', async () => {
    actor.send({ type: 'START_GAME' });
    await waitFor(
      actor,
      (s) => s.matches({ gameActive: 'waitingForGuess' }),
      WAIT_TIMEOUT,
    );
    actor.send({ type: 'PLAYER_DISCONNECTED' });
    expect(actor.getSnapshot().value).toBe('closed');
  });
});
