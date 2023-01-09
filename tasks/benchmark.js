
/* IMPORT */

import {assert} from 'fava';
import {deflateSync, inflateSync} from 'fflate';
import fs from 'node:fs';
import {compress, decompress} from '../dist/index.js';

/* HELPERS */

const FIXTURE = new Uint8Array ( fs.readFileSync ( 'tasks/fixture.txt' ) );

/* MAIN */

{
  console.time ( 'huffy.compress' );
  const compressed = compress ( FIXTURE );
  console.timeEnd ( 'huffy.compress' );

  console.time ( 'huffy.decompress' );
  const decompressed = decompress ( compressed );
  console.timeEnd ( 'huffy.decompress' );

  console.log ( 'huffy.ratio', compressed.length / FIXTURE.length );
  assert.deepEqual ( FIXTURE, decompressed );
}

{
  console.time ( 'fflate.deflate' );
  const deflated = deflateSync ( FIXTURE );
  console.timeEnd ( 'fflate.deflate' );

  console.time ( 'fflate.inflate' );
  const inflated = inflateSync ( deflated );
  console.timeEnd ( 'fflate.inflate' );

  console.log ( 'fflate.ratio', deflated.length / FIXTURE.length );
  assert.deepEqual ( FIXTURE, inflated );
}
