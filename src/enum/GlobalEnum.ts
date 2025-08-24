export enum MessageType {
  SUCCESS = 'success',
  ERROR = 'error',
}

export enum ResponseCode {
  SUCCESS = '00',
  NOT_FOUND = '06',
  UNAUTHORIZED = '69',
  VALIDATION_ERROR = '96',
  ERROR = '99',
}

export enum HTTPCode {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  INTERNAL_SERVER_ERROR = 500,
}
