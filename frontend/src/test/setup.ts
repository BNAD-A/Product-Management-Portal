import { vi } from "vitest";

export const mockUseQuery = vi.fn();
export const mockUseMutation = vi.fn();

vi.mock("@apollo/client/react", async () => {
  const actual = await vi.importActual<typeof import("@apollo/client/react")>("@apollo/client/react");

  return {
    ...actual,
    useQuery: (...args: unknown[]) => mockUseQuery(...args),
    useMutation: (...args: unknown[]) => mockUseMutation(...args),
  };
});
