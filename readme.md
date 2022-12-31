# Huffy

A tiny compression library based on Huffman coding.

## Install

```sh
npm install --save huffy
```

## Usage

```ts
import {compress, decompress} from 'huffy';

const str = 'some string to compress';
const buffer = new TextEncoder ().encode ( str );

const compressed = compress ( buffer );
const decompressed = decompress ( compressed );

console.log ( 'Compression ratio:', compressed.length / buffer.length );
```

## License

MIT © Fabio Spampinato
