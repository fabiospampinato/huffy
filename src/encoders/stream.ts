
/* IMPORT */

import {ReadableStream} from '../stream';

/* MAIN */

// This encodes/decodes a ReadableStream into/from a Uint8Array

const encode = ( stream: ReadableStream ): Uint8Array => {

  return stream.buffer;

};

const decode = ( uint8: Uint8Array ): ReadableStream => {

  const stream = new ReadableStream ( 0 );

  stream.buffer = uint8;

  return stream;

};

/* EXPORT */

export {encode, decode};
