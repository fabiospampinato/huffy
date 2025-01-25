
/* IMPORT */

import {encode as huffmanEncode, decode as huffmanDecode} from './huffman';
import {encode as intEncode, decode as intDecode} from './int';
import {encode as streamEncode, decode as streamDecode} from './stream';
import {encode as treeEncode, decode as treeDecode} from './tree';

/* MAIN */

// This compresses/decompresses a Uint8Array into/from a single Uint8Array archive containing both data and metadata
// The type of the archive depends on the exact situation, a type is picked automatically
// The uncompressed archive format is the following:
//   0: 1-byte - uncompressed archive
//   A: N-byte - uncompressed data
// The compressed archive format is the following:
//   1: 1-byte - compressed archive
//   A: 4-byte - decompressed length
//   B: 4-byte - tree structure length
//   C: 4-byte - tree data length
//   D: N-byte - tree structure
//   E: N-byte - tree data
//   F: N-byte - compressed data

const encode = ( input: Uint8Array ): Uint8Array => {

  const [encoded, root, length] = huffmanEncode ( input );
  const ratio = encoded.buffer.length / input.length;

  if ( ratio >= 0.95 ) { // Barely any compression, creating an uncompressed archive

    const archive = new Uint8Array ( 1 + input.length );

    archive[0] = 0;
    archive.set ( input, 1 );

    return archive;

  } else { // Some decent compression, creating a compressed archive

    const [structureStream, data] = treeEncode ( root );

    const d = streamEncode ( structureStream );
    const a = intEncode ( length );
    const b = intEncode ( d.length );
    const c = intEncode ( data.length );
    const e = data;
    const f = streamEncode ( encoded );

    const archive = new Uint8Array ( 1 + a.length + b.length + c.length + d.length + e.length + f.length );

    archive[0] = 1;
    archive.set ( a, 1 );
    archive.set ( b, 1 + a.length );
    archive.set ( c, 1 + a.length + b.length );
    archive.set ( d, 1 + a.length + b.length + c.length );
    archive.set ( e, 1 + a.length + b.length + c.length + d.length );
    archive.set ( f, 1 + a.length + b.length + c.length + d.length + e.length );

    return archive;

  }

};

const decode = ( archive: Uint8Array ): Uint8Array => {

  const type = archive[0];

  if ( type === 0 ) { // Uncompressed archive

    return archive.slice ( 1 );

  } else if ( type === 1 ) { // Compressed archive

    const inputLength = intDecode ( archive.slice ( 1, 5 ) );
    const structureLength = intDecode ( archive.slice ( 5, 9 ) );
    const dataLength = intDecode ( archive.slice ( 9, 13 ) );

    const structure = archive.subarray ( 13, 13 + structureLength );
    const data = archive.subarray ( 13 + structureLength, 13 + structureLength + dataLength );
    const encoded = archive.subarray ( 13 + structureLength + dataLength );

    const root = treeDecode ( streamDecode ( structure ), data );
    const decoded = huffmanDecode ( streamDecode ( encoded ), root, inputLength );

    return decoded;

  } else { // Unsupported archive

    throw new Error ( 'Unsupported archive' );

  }

};

/* EXPORT */

export {encode, decode};
