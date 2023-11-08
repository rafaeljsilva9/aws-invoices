export type StatusCodeDescription = {
  code: number,
  message: string,
};

export class HttpStatusCode {
  public static SUCCESS: StatusCodeDescription = {
    code: 200,
    message: 'Success.'
  };

  public static BAD_REQUEST_ERROR: StatusCodeDescription = {
    code: 400,
    message: 'Bad request.'
  };

  public static UNAUTHORIZED_ERROR: StatusCodeDescription = {
    code: 401,
    message: 'Unauthorized error.'
  };

  public static ACCESS_DENIED_ERROR: StatusCodeDescription = {
    code: 403,
    message: 'Access denied.'
  };

  public static NOT_FOUND_ERROR: StatusCodeDescription = {
    code: 404,
    message: 'Not Found.'
  };

  public static CONFLICT: StatusCodeDescription = {
    code: 409,
    message: 'Conflict.'
  };

  public static INTERNAL_ERROR: StatusCodeDescription = {
    code: 500,
    message: 'Internal error.'
  };

  public static SERVICE_UNAVAILABLE: StatusCodeDescription = {
    code: 503,
    message: 'Service unavailable.'
  };
}
