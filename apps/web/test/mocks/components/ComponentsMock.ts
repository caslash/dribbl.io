import { MockButton, MockCard, MockInput } from '.';

/**
 * Aggregate object shaped to match the `@/components` barrel.
 * Spread into `vi.mock('@/components', ...)` to replace all shared components
 * with passthrough test doubles in one call.
 *
 * @example
 * vi.mock('@/components', async () => {
 *   const { ComponentsMock } = await import('../mocks/components/ComponentsMock');
 *   return { ...ComponentsMock };
 * });
 */
export const ComponentsMock = {
  Button: MockButton,
  Card: MockCard,
  Input: MockInput,
};
