import {
  HttpStatusBadGateway,
  HttpStatusBadRequest,
  HttpStatusConflict,
  HttpStatusContentTooLarge,
  HttpStatusExpectationFailed,
  HttpStatusFailedDependency,
  HttpStatusForbidden,
  HttpStatusGatewayTimeout,
  HttpStatusGone,
  HttpStatusImATeapot,
  HttpStatusInsufficientStorage,
  HttpStatusInternalServerError,
  HttpStatusLocked,
  HttpStatusMethodNotAllowed,
  HttpStatusMisdirectedRequest,
  HttpStatusNotAcceptable,
  HttpStatusNotExtended,
  HttpStatusNotFound,
  HttpStatusNotImplemented,
  HttpStatusPaymentRequired,
  HttpStatusPreconditionFailed,
  HttpStatusPreconditionRequired,
  HttpStatusProxyAuthenticationRequired,
  HttpStatusRequestHeaderFieldsTooLarge,
  HttpStatusServiceUnavailable,
  HttpStatusTooManyRequests,
  HttpStatusUnauthorized,
  HttpStatusUnavailableForLegalReasons,
  HttpStatusUnprocessableContent,
  HttpStatusUnsupportedMediaType,
} from '../../error/http/errors.js'

export default function httpErrorClasses() {
  const clientErrorClasses = [
    HttpStatusBadRequest, // 400
    HttpStatusUnauthorized, // 401
    HttpStatusPaymentRequired, // 402
    HttpStatusForbidden, // 403
    HttpStatusNotFound, // 404
    HttpStatusMethodNotAllowed, // 405
    HttpStatusNotAcceptable, // 406
    HttpStatusProxyAuthenticationRequired, // 407
    HttpStatusConflict, // 409
    HttpStatusGone, // 410
    HttpStatusPreconditionFailed, // 412
    HttpStatusContentTooLarge, // 413
    HttpStatusUnsupportedMediaType, // 415
    HttpStatusExpectationFailed, // 417
    HttpStatusImATeapot, // 418
    HttpStatusMisdirectedRequest, // 421
    HttpStatusUnprocessableContent, // 422
    HttpStatusLocked, // 423
    HttpStatusFailedDependency, // 424
    HttpStatusPreconditionRequired, // 428
    HttpStatusTooManyRequests, // 429
    HttpStatusRequestHeaderFieldsTooLarge, // 431
    HttpStatusUnavailableForLegalReasons, // 451
  ] as const

  const serverErrorClasses = [
    HttpStatusInternalServerError, // 500
    HttpStatusNotImplemented, // 501
    HttpStatusBadGateway, // 502
    HttpStatusServiceUnavailable, // 503
    HttpStatusGatewayTimeout, // 504
    HttpStatusInsufficientStorage, // 507
    HttpStatusNotExtended, // 510
  ] as const

  return [...clientErrorClasses, ...serverErrorClasses]
}

export function rescuableHttpErrorClasses() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unrescuableClasses = [HttpStatusInternalServerError] as any[]

  return httpErrorClasses().filter(klass => !unrescuableClasses.includes(klass))
}
