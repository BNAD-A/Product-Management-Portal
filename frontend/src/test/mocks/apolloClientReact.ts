import { vi } from "vitest";

vi.mock("@apollo/client/react", async () => {
    const actual = await vi.importActual<typeof import("@apollo/client/react")>("@apollo/client/react");

    return {
        ...actual,
        useQuery: vi.fn(),
        useMutation: vi.fn(),
    };
});
