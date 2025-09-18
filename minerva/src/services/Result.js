export class Result {
    #value;
    #isSuccess;
    #error;

    constructor(value, isSuccess, error) {
        this.#value = value;
        this.#isSuccess = isSuccess;
        this.#error = error;
    }

    // Getter para value
    get value() {
        return this.#value;
    }

    // Getter para isSuccess
    get isSuccess() {
        return this.#isSuccess;
    }

    // Getter para error
    get error() {
        return this.#error;
    }

    // Método estático para resultado exitoso
    static success(value) {
        return new Result(value, true, null);
    }

    // Método estático para resultado fallido
    static failure(error) {
        return new Result(null, false, error);
    }
}
