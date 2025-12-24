export class ServiceResponse {
  readonly success: boolean;
  readonly message: string;

  private constructor(success: boolean, message: string) {
    this.success = success;
    this.message = message;
  }

  static success(message: string) {
    return new ServiceResponse(true, message);
  }

  static failure(message: string) {
    return new ServiceResponse(false, message);
  }
}
