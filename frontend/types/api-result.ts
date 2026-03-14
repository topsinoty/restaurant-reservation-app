export interface ApiResult<T> {
	success: boolean;
	message: string;
	data: T;
}
