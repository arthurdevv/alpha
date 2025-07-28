/* eslint-disable no-underscore-dangle */
import { Transform, type TransformCallback } from 'stream';

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
