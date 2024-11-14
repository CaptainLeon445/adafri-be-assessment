export type ResponseObject = { statusCode: number, message?: string, data?: Record<string, any>, meta?: string | Record<string, any> }
export type PaginationObject = { offset: number; limit: number }