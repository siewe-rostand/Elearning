class ErrorHandler extends Error {
  keyValue(keyValue: any) {
    throw new Error("Method not implemented.");
  }
  statusCode: number;
  path: any;
  code: number | string | undefined;
  constructor(message: string, statusCode: number) {
    super(message);
    Object.setPrototypeOf(this, ErrorHandler.prototype);
    this.statusCode = statusCode;
  }
}

export default ErrorHandler;
