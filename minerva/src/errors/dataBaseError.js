export class DataBaseError extends Error {
  constructor(code, errno, sqlMessage, sqlState, sql) {
    super(sqlMessage);

    this.name = this.constructor.name;

    this.code = code;
    this.errno = errno;
    this.sqlState = sqlState;
    this.sql = sql;
}
}
