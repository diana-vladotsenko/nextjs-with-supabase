/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import { vi } from "vitest";
import '@testing-library/jest-dom/vitest';
import React from "react";

(globalThis as any).React = React;

vi.stubGlobal("Response", Response);