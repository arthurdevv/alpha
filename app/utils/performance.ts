class Performance {
  private timestamp: number = 0;

  private called: boolean = false;

  private timeout!: NodeJS.Timeout;

  private readonly delay: number;

  constructor(
    delay: number,
    private callback: Function,
  ) {
    this.delay = delay;
  }

  set(value: number) {
    this.timestamp = value;

    if (this.timeout) clearTimeout(this.timeout);

    this.called = false;

    this.timeout = setTimeout(() => {
      if (!this.called) {
        this.callback();

        this.called = true;
      }
    }, this.delay);
  }

  get() {
    return this.timestamp;
  }
}

export default Performance;
