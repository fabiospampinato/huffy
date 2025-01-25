
/* IMPORT */

import {ReadableStream, WritableStream} from '../stream';
import {Node} from '../tree';
import type {Cursor} from '../types';

/* HELPERS */

const encodeInner = ( node: Node | undefined, structure: WritableStream, data: Uint8Array, cursor: Cursor ): void => {

  if ( node ) {

    structure.write ( 1 );
    data[cursor.value++] = node.value;

    encodeInner ( node.left, structure, data, cursor );
    encodeInner ( node.right, structure, data, cursor );

  } else {

    structure.write ( 0 );

  }

};

const decodeInner = ( structure: ReadableStream, data: Uint8Array, cursorStructure: Cursor, cursorData: Cursor ): Node | undefined => {

  const isNode = structure.read ( cursorStructure.value++ );

  if ( !isNode ) return;

  const value = data[cursorData.value++];
  const node = new Node ( value, 0 );

  node.left = decodeInner ( structure, data, cursorStructure, cursorData );
  node.right = decodeInner ( structure, data, cursorStructure, cursorData );

  return node;

};

/* MAIN */

// This encodes/decodes succinctly a binary tree containing byte values
// "1" and "0" in the structure indicate whether a left or right child node exists or not

const encode = ( node: Node ): [ReadableStream, Uint8Array] => {

  const nodes = node.nodes ();
  const leaves = node.leaves ();
  const cursor = { value: 0 };

  const structure = new WritableStream ( nodes + ( leaves * 2 ) );
  const data = new Uint8Array ( nodes );

  encodeInner ( node, structure, data, cursor );

  return [structure, data];

};

const decode = ( structure: ReadableStream, data: Uint8Array ): Node => {

  const cursorStructure = { value: 0 };
  const cursorData = { value: 0 };

  return decodeInner ( structure, data, cursorStructure, cursorData )!;

};

/* EXPORT */

export {encode, decode};
