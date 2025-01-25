# Huffy

A tiny compression library based on Huffman coding.

## Install

```sh
npm install huffy
```

## Usage

```ts
import {compress, decompress} from 'huffy';

// Let's make some data to compress

const str = 'some string to compress, it works better with longer things'.repeat ( 10 );
const buffer = new TextEncoder ().encode ( str );

// Let's compress and decompress it

const compressed = compress ( buffer );
const decompressed = decompress ( compressed );

// Let's print the compression ratio

console.log ( 'Compression ratio:', compressed.length / buffer.length );
```

## License

MIT © Fabio Spampinato
