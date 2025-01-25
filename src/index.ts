
/* IMPORT */

import {encode, decode} from './encoders/archive';

/* MAIN */

const compress = encode;
const decompress = decode;

/* EXPORT */

export {compress, decompress};
