import { vi } from "vitest";

type UseQueryResult = {
  data?: any;
  loading: boolean;
  error?: any;
  refetch: () => Promise<any>;
};

export const mockUseQuery = vi.fn<[], UseQueryResult>(() => ({
  data: undefined,
  loading: false,
  error: undefined,
  refetch: vi.fn(async () => ({})),
}));

export const mockUseMutation = vi.fn(() => [
  vi.fn(async () => ({ data: {} })), // mutate fn
  { loading: false, error: undefined }, // result
]);