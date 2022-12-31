
/* MAIN */

// This encodes/decodes a 32-bit unsigned integer into/from a 4-byte Uint8Array
// The resulting encoding depends on the endianness of the platform (!)

const encode = ( int: number ): Uint8Array => {

  const uint32 = new Uint32Array ([ int ]);
  const uint8 = new Uint8Array ( uint32.buffer );

  return uint8;

};

const decode = ( uint8: Uint8Array ): number => {

  const uint32 = new Uint32Array ( uint8.buffer );
  const int = uint32[0];

  return int;

};

/* EXPORT */

export {encode, decode};
