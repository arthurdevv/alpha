import { EventEmitter } from 'node:events';
import { StringDecoder } from 'node:string_decoder';

const BATCH_DURATION_MS = 16;
const BATCH_MAX_SIZE = 200 * 1024;

class DataBatcher extends EventEmitter {
  private data: string;
  private decoder: StringDecoder;
  private timeout: NodeJS.Timeout | null;

  constructor(private id: UUID) {
    super();
    this.decoder = new StringDecoder('utf8');
    this.data = id;
    this.timeout = null;
  }

  write(chunk: Buffer | string) {
    const decoded = typeof chunk === 'string' ? chunk : this.decoder.write(chunk);

    if (this.data.length + decoded.length >= BATCH_MAX_SIZE) {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }

      this.flush();
    }

    this.data += decoded;

    if (!this.timeout) {
      this.timeout = setTimeout(() => this.flush(), BATCH_DURATION_MS);
    }
  }

  flush() {
    const { data } = this;

    this.data = this.id;
    this.timeout = null;

    this.emit('flush', data);
  }
}

export default DataBatcher;
