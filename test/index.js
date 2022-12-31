
/* IMPORT */

import fc from 'fast-check';
import {describe} from 'fava';
import * as Archive from '../dist/encoders/archive.js';
import * as Huffman from '../dist/encoders/huffman.js';
import * as Int from '../dist/encoders/int.js';
import * as Stream from '../dist/encoders/stream.js';
import * as Tree from '../dist/encoders/tree.js';
import {Node} from '../dist/tree.js';
import {WritableStream} from '../dist/stream.js';

/* MAIN */

describe ( 'Huffy', () => {

  describe ( 'archive encoder', it => {

    it ( 'can encode and decode a buffer', t => {

      const inputRaw = 'bcaadddccacacacbcaadddccacacacbcaadddccacacacbcaadddccacacacbcaadddccacacac';
      const input = new TextEncoder ().encode ( inputRaw );
      const input2 = Archive.decode ( Archive.encode ( input ) );

      t.deepEqual ( input, input2 );

    });

    it ( 'can encode and decode a repeating charaxter', t => {

      for ( let i = 0; i < 1000; i++ ) {

        const input = new TextEncoder ().encode ( 'a'.repeat ( i ) );
        const input2 = Archive.decode ( Archive.encode ( input ) );

        t.deepEqual ( input, input2 );

      }

    });

    it ( 'can encode and decode fc-generated buffers', t => {

      const encoder = new TextEncoder ();
      const encode = str => encoder.encode ( str );
      const assert = str => t.deepEqual ( Archive.decode ( Archive.encode ( encode ( str ) ) ), encode ( str ) );
      const property = fc.property ( fc.fullUnicodeString (), assert );

      fc.assert ( property, { numRuns: 1_000_000 } );

    });

  });

  describe ( 'huffman encoder', it => {

    it ( 'can encode and decode a buffer', t => {

      const inputRaw = 'bcaadddccacacacbcaadddccacacacbcaadddccacacacbcaadddccacacacbcaadddccacacac';
      const input = new TextEncoder ().encode ( inputRaw );
      const input2 = Huffman.decode ( ...Huffman.encode ( input ) );

      t.deepEqual ( input, input2 );

    });

  });

  describe ( 'int encoder', it => {

    it ( 'can encode and decode an integer', t => {

      const nr = 3_293_871_293;
      const nr2 = Int.decode ( Int.encode ( nr ) );

      t.is ( nr, nr2 );

    });

  });

  describe ( 'stream encoder', it => {

    it ( 'can encode and decode streams', t => {

      const bits = [1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0];
      const stream = new WritableStream ();
      bits.forEach ( bit => stream.write ( bit ) );
      const stream2 = Stream.decode ( Stream.encode ( stream ) );

      t.deepEqual ( stream.buffer, stream2.buffer );

    });

  });

  describe ( 'tree encoder', it => {

    it ( 'can encode and decode a tree', t => {

      const root = new Node ( 2, 0 );
      root.left = new Node ( 3, 0 );
      root.right = new Node ( 5, 0 );
      root.left.left = new Node ( 7, 0 );
      root.left.right = new Node ( 11, 0 );
      root.right.right = new Node ( 13, 0 );
      const root2 = Tree.decode ( ...Tree.encode ( root ) );

      t.is ( JSON.stringify ( root ), JSON.stringify ( root2 ) );

    });

  });

});
