import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utilities/catch-async-error";
import { sendResponse } from "../utilities/responses.utilities";
import Access, { AccessAttributes } from "../models/access.models";
import { ResponseObject } from "../types";
import { StatusCodes } from "http-status-codes";
import { getAccessKeysPayload } from "../utilities/global.utilities";
import { getErrorMessage } from "../middlewares/error_handlers/global-handler";
import { AccessKeyErrors } from "../constants/errors.constants";



export default class AccessKeyController {
    public getAccessKeys = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const data = await Access.findOne({ where: { id: 1 } })
        if (!data) return getErrorMessage(next, AccessKeyErrors.NOT_FOUND, StatusCodes.NOT_FOUND)
        const responseData: ResponseObject = { statusCode: StatusCodes.OK, message: "Authorization keys returned successully", data }
        return sendResponse(res, responseData)
    });

    public createAccessKeys = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const data = await Access.findAll()
        let responseData: ResponseObject = { statusCode: StatusCodes.OK, message: "Authorization keys returned successully", data }
        if (data.length > 0) responseData.data = data
        const payload: AccessAttributes = getAccessKeysPayload()
        const response = await Access.create(payload)
        if (response) {
            responseData.statusCode = StatusCodes.CREATED
            responseData.message = "Authorization keys created sucessfully"
        }
        return sendResponse(res, responseData)
    });

    public resetAccessKeys = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const payload: AccessAttributes = getAccessKeysPayload()
        const data = await Access.findOne({ where: { id: 1 } })
        if (!data) return getErrorMessage(next, AccessKeyErrors.NOT_FOUND, StatusCodes.NOT_FOUND)
        await data.update(payload)
        const responseData: ResponseObject = { statusCode: StatusCodes.OK, message: "Authorization keys returned successully", data }
        return sendResponse(res, responseData)
    });
}
