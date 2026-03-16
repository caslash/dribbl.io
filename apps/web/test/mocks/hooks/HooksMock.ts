import { useMockDraft } from './index';

/**
 * Aggregate object shaped to match the `@/hooks` barrel.
 * Spread into `vi.mock('@/hooks', ...)` to replace all hooks with test doubles
 * in one call.
 *
 * @example
 * vi.mock('@/hooks', async () => {
 *   const { HooksMock } = await import('../mocks/hooks/HooksMock');
 *   return { ...HooksMock };
 * });
 */
export const HooksMock = {
  useDraft: useMockDraft,
};
