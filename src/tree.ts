
/* IMPORT */

import type {Byte} from '~/types';

/* MAIN */

class Node {

  /* VARIABLES */

  value: Byte;
  weight: number;
  parent?: Node;
  left?: Node;
  right?: Node;

  /* CONSTRUCTOR */

  constructor ( value: Byte, weight: number ) {

    this.value = value;
    this.weight = weight;

  }

  /* API */

  leaves (): number {

    return ( ( this.left?.leaves () || 0 ) + ( this.right?.leaves () || 0 ) ) || 1;

  }

  nodes (): number {

    return ( this.left?.nodes () || 0 ) + ( this.right?.nodes () || 0 ) + 1;

  }

}

/* EXPORT */

export {Node};
