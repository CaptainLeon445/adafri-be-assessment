export type ResponseObject = { statusCode: number, message?: string, data?: Record<string, any>, meta?: string | Record<string, any> }
export type PaginationObject = { offset: number; limit: number }

export type FacebookAdPayload = {
    daily_budget?: number;
    name?: string;
    start_time?: string;
    stop_time?: string;
    status?: string;
};