import { Transform } from 'node:stream';
import type { TransformCallback } from 'node:stream';

class HexParser extends Transform {
  constructor(options = {}) {
    super({ ...options, readableObjectMode: true });
  }

  _transform(chunk: any, _, callback: TransformCallback): void {
    chunk = chunk
      .toString('hex')
      .match(/.{1,2}/g)
      .join(' ');

    this.push(chunk);

    callback();
  }
}

export default HexParser;
