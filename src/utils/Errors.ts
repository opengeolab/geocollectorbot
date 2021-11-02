export class ProcessError extends Error {
  readonly reply: string

  constructor (message: string, reply: string) {
    super(message)

    this.reply = reply

    Object.setPrototypeOf(this, ProcessError.prototype)
  }
}
