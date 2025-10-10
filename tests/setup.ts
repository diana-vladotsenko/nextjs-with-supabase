import "@testing-library/jest-dom";
import { vi } from "vitest";
import '@testing-library/jest-dom/vitest';

vi.stubGlobal("Response", Response);