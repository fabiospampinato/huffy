
/* IMPORT */

import {encode as huffmanEncode, decode as huffmanDecode} from '~/encoders/huffman';
import {encode as intEncode, decode as intDecode} from '~/encoders/int';
import {encode as streamEncode, decode as streamDecode} from '~/encoders/stream';
import {encode as treeEncode, decode as treeDecode} from '~/encoders/tree';

/* MAIN */

// This compresses/decompresses a Uint8Array into/from a single Uint8Array archive containing both data and metadata
// The archive format is the following:
//   A: 4-byte - decompressed length
//   B: 4-byte - tree structure length
//   C: 4-byte - tree data length
//   D: N-byte - tree structure
//   E: N-byte - tree data
//   F: N-byte - compressed data

const encode = ( input: Uint8Array ): Uint8Array => {

  const [encoded, root, length] = huffmanEncode ( input );
  const [structureStream, data] = treeEncode ( root );

  const d = streamEncode ( structureStream );
  const a = intEncode ( length );
  const b = intEncode ( d.length );
  const c = intEncode ( data.length );
  const e = data;
  const f = streamEncode ( encoded );

  const archive = new Uint8Array ( a.length + b.length + c.length + d.length + e.length + f.length );

  archive.set ( a, 0 );
  archive.set ( b, a.length );
  archive.set ( c, a.length + b.length );
  archive.set ( d, a.length + b.length + c.length );
  archive.set ( e, a.length + b.length + c.length + d.length );
  archive.set ( f, a.length + b.length + c.length + d.length + e.length );

  return archive;

};

const decode = ( archive: Uint8Array ): Uint8Array => {

  const inputLength = intDecode ( archive.slice ( 0, 4 ) );
  const structureLength = intDecode ( archive.slice ( 4, 8 ) );
  const dataLength = intDecode ( archive.slice ( 8, 12 ) );

  const structure = archive.subarray ( 12, 12 + structureLength );
  const data = archive.subarray ( 12 + structureLength, 12 + structureLength + dataLength );
  const encoded = archive.subarray ( 12 + structureLength + dataLength );

  const root = treeDecode ( streamDecode ( structure ), data );
  const decoded = huffmanDecode ( streamDecode ( encoded ), root, inputLength );

  return decoded;

};

/* EXPORT */

export {encode, decode};
