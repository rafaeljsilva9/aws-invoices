import { StatusCodeDescription } from "../api-lambda/http-status-code";

export type ExceptionPayload<TData> = {
  code: StatusCodeDescription,
  overrideMessage?: string,
  data?: TData
};

export class Exception<TData> extends Error {
  public readonly code: number;
  public readonly data: TData | undefined;
  
  private constructor(codeDescription: StatusCodeDescription, overrideMessage?: string, data?: TData) {
    super();
    
    this.name = this.constructor.name;
    this.code = codeDescription.code;
    this.data = data;
    this.message = overrideMessage || codeDescription.message;
    
    Error.captureStackTrace(this, this.constructor);
  }
  
  public static new<TData>(payload: ExceptionPayload<TData>): Exception<TData> {
    return new Exception(payload.code, payload.overrideMessage, payload.data);
  }
}
