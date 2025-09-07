export class DataBaseError extends Error {
  constructor(code, errno, sqlMessage, sqlState, sql) {
  this.name = this.constructor.name;

  this.code = code;
  this.errno = errno;
  this.sqlMessage = sqlMessage;
  this.sqlState = sqlState;
  this.sql = sql;
}
}
