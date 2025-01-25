
/* IMPORT */

import {ReadableStream, WritableStream} from '../stream';
import {Node} from '../tree';
import type {Bit, Byte, DecodeState} from '../types';

/* HELPERS */

const getLeaves = ( input: Uint8Array ): Node[] => {

  const weights = new Array ( 256 ).fill ( 0 );

  input.forEach ( byte => weights[byte] += 1 );

  const nodes = weights.map ( ( weight, value ) => new Node ( value, weight ) );
  const nodesFiltered = nodes.filter ( node => node.weight );
  const nodesSorted = nodesFiltered.sort ( ( a, b ) => a.weight - b.weight );

  return nodesSorted;

};

const getRoot = ( leaves: Node[] ): Node => {

  // Two queues approach as described in WikiPedia https://en.wikipedia.org/wiki/Huffman_coding

  if ( leaves.length === 0 ) return new Node ( 0, 0 ); // Special case, returning a dummy node

  if ( leaves.length === 1 ) return getRoot ( [leaves[0], leaves[0]] ); // Special case, adding a dummy node to the tree

  const queue1: Node[] = [...leaves];
  const queue2: Node[] = [];

  const shiftLightest = (): Node | undefined => {
    if ( !queue1.length ) return queue2.shift ();
    if ( !queue2.length ) return queue1.shift ();
    if ( queue1[0].weight <= queue2[0].weight ) return queue1.shift ();
    return queue2.shift ();
  };

  while ( true ) {
    if ( queue1.length + queue2.length <= 1 ) break;
    const node1 = shiftLightest ()!;
    const node2 = shiftLightest ()!;
    const parent = new Node ( 0, node1.weight + node2.weight );
    parent.left = node1;
    parent.right = node2;
    node1.parent = parent;
    node2.parent = parent;
    queue2.push ( parent );
  }

  const root = queue2[0];

  return root;

};

const getPaths = ( leaves: Node[] ): Record<Byte, Bit[]> => {

  const paths: Record<Byte, Bit[]> = {};

  leaves.forEach ( leaf => {

    const path: Bit[] = [];

    let node = leaf;

    while ( node.parent ) {

      const bit = ( node.parent.left === node ) ? 0 : 1;

      path.push ( bit );

      node = node.parent;

    }

    paths[leaf.value] = path.reverse ();

  });

  return paths;

};

/* MAIN */

// This encodes/decodes a Uint8Array using Huffman coding

const encode = ( input: Uint8Array ): [ReadableStream, Node, number] => {

  const leaves = getLeaves ( input );
  const root = getRoot ( leaves );
  const paths = getPaths ( leaves );

  const length = leaves.reduce ( ( acc, leaf ) => acc + ( leaf.weight * paths[leaf.value].length ), 0 );
  const encoded = new WritableStream ( length );

  for ( let ii = 0, il = input.length; ii < il; ii++ ) {
    const path = paths[input[ii]];
    for ( let oi = 0, ol = path.length; oi < ol; oi++ ) {
      encoded.write ( path[oi] );
    }
  }

  return [encoded, root, input.length];

};

const decode = ( output: ReadableStream, root: Node, length: number ): Uint8Array => {

  const decoded = new Uint8Array ( length );
  const buffer = output.buffer;

  let chunk: number[];
  let cursor = 0;
  let state: DecodeState = { chunk: [], node: root };
  let node2state = new Map<Node, DecodeState> ([[ root, state ]]);

  for ( let i = 1, l = buffer.length; i < l; i++ ) {

    const byte = buffer[i];
    const stateNext = state[byte];

    if ( stateNext ) {

      chunk = stateNext.chunk;
      state = stateNext.state || stateNext;

    } else {

      chunk = [];

      let node = state.node;
      for ( let i = 7; i >= 0; i-- ) {
        const bit = ( byte >> i ) & 1;
        node = ( bit ? node.right : node.left )!;
        if ( !node.left && !node.right ) {
          chunk.push ( node.value );
          node = root;
        }
      }

      const stateThis: DecodeState = { chunk, node, state };
      const stateNext = stateThis.state = ( node2state.get ( node ) || stateThis );

      state[byte] = stateThis;
      state = stateNext;
      node2state.set ( node, stateNext );

    }

    for ( let ci = 0, cl = chunk.length; ci < cl; ci++ ) {

      decoded[cursor++] = chunk[ci];

    }

  }

  return decoded;

};

/* EXPORT */

export {encode, decode};
