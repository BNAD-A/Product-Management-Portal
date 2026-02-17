import { vi } from "vitest";

vi.mock("@apollo/client/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@apollo/client/react")>();

  return {
    ...actual,
    useQuery: vi.fn(),
    useMutation: vi.fn(),
  };
});

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
  vi.fn(async () => ({ data: {} })),
  { loading: false, error: undefined },
]);
