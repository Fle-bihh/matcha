export type ApiResponse<T> = {
	success: boolean;
	message: string;
	responseObject: T;
	statusCode: number;
};
