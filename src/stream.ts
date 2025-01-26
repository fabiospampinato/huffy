
/* IMPORT */

import type {Bit} from './types';

/* MAIN */

// Streams are used to encode/decode data in a bit-wise fashion
// The first value in the buffer indicates the padding of the last byte
// The padding counts how many bits are not actually used in the last byte

class ReadableStream {

  /* VARIABLES */

  buffer: Uint8Array;

  /* CONSTRUCTOR */

  constructor ( length: number ) {

    const byteLength = 1 + Math.ceil ( length / 8 );
    const bitPadding = ( ( byteLength - 1 ) * 8 ) - length;

    this.buffer = new Uint8Array ( byteLength );
    this.buffer[0] = bitPadding;

  }

  /* API */

  readBit ( index: number ): Bit {

    const byteIndex = 1 + Math.floor ( index / 8 );
    const bitIndex = 7 - ( index % 8 );

    return ( this.buffer[byteIndex] >> bitIndex ) & 1;

  }

}

class WritableStream extends ReadableStream {

  /* VARIABLES */

  cursor: number = 0;

  /* API */

  writeBit ( bit: Bit ): void {

    const byteIndex = 1 + Math.floor ( this.cursor / 8 );
    const bitIndex = 7 - ( this.cursor % 8 );

    this.buffer[byteIndex] |= ( bit << bitIndex );
    this.cursor += 1;

  }

}

/* EXPORT */

export {ReadableStream, WritableStream};
