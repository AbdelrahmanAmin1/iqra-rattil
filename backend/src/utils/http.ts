export class HttpError extends Error {
  status: number;
  code: string;
  fields?: unknown;

  constructor(status: number, code: string, message: string, fields?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export const ok = <T>(data: T) => ({ data });
