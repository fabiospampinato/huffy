
/* IMPORT */

import {assert} from 'fava';
import {deflateSync, inflateSync} from 'fflate';
import fs from 'node:fs';
import colors from 'tiny-colors';
import {compress, decompress} from '../dist/index.js';

/* HELPERS */

const FIXTURE1 = new Uint8Array ( fs.readFileSync ( 'tasks/fixture.txt' ) );
const FIXTURE2 = deflateSync ( FIXTURE1 );
const FIXTURE3 = new TextEncoder ().encode ( 'a'.repeat ( 100_000 ) );
const FIXTURE4 = new TextEncoder ().encode ( 'a'.repeat ( 100 ) );
const FIXTURES = [['War and Peace -> Clear', FIXTURE1], ['War and Peace -> Compressed', FIXTURE2], ['Repeating -> Long', FIXTURE3], ['Repeating -> Short', FIXTURE4]];

/* MAIN */

for ( const [name, FIXTURE] of FIXTURES ) {

  console.log ( colors.cyan ( name ) );

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

}
