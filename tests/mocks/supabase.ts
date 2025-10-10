/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { vi } from "vitest";

export function createSupabaseMock() {
  const calls: any = [];

  const api = {
    from: vi.fn().mockImplementation((table: string) => {
      const chain = {
        insert: vi.fn().mockImplementation((payload: any) => {
          calls.push({ op: "insert", table, payload });
          return Promise.resolve({ error: null });
        }),
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockImplementation((col: string, val: any) => {
            calls.push({ op: "delete", table, where: { [col]: val } });
            return Promise.resolve({ error: null });
          }),
        }),
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockImplementation((_col: string) => {
            return Promise.resolve({
              data: [
                { id: 1, title: "First" },
                { id: 2, title: "Second" },
              ],
              error: null,
            });
          }),
        }),
      };
      return chain;
    }),
    __calls: calls,
  };

  return api;
}
