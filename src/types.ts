
/* IMPORT */

import type {Node} from './tree';

/* MAIN */

type Bit = number;

type Byte = number;

type Cursor = {
  value: number
};

type DecodeState = {
  [byte: Byte]: DecodeState | undefined,
  chunk: number[],
  node: Node,
  state?: DecodeState
};

/* EXPORT */

export type {Bit, Byte, Cursor, DecodeState};
