import { StatusCodeDescription } from "../api-lambda/http-status-code";

export type ExceptionPayload = {
  code: StatusCodeDescription,
  overrideMessage?: string
};

export class Exception extends Error {
  public readonly code: number;
  
  private constructor(codeDescription: StatusCodeDescription, overrideMessage?: string) {
    super();
    
    this.name = this.constructor.name;
    this.code = codeDescription.code;
    this.message = overrideMessage || codeDescription.message;
    
    Error.captureStackTrace(this, this.constructor);
  }
  
  public static new(payload: ExceptionPayload): Exception {
    return new Exception(payload.code, payload.overrideMessage);
  }
}
