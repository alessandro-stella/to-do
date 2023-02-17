export enum status {
    success = 200,
    created = 201,
    alreadyExisting = 409,
    serverError = 500,
    wrongCredentials = 401,
    resourceNotFound = 404,
}
