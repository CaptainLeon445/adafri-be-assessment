import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utilities/catch-async-error";
import Campaign from "../models/campaign";
import { getMetrics } from "../api/twitter";
import CampaignService from "../services/campaign";
import { sendResponse } from "../utilities/responses.utilities";
import { PaginationObject, ResponseObject } from "../types";
import { StatusCodes } from "http-status-codes";
import { pagination } from "../utilities/global.utilities";


export default class CampaignController {
    constructor(private readonly campaignService: CampaignService) {}
    public getCampaigns = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const paginate:PaginationObject=pagination(req)
        const data = await this.campaignService.getCampaigns(paginate)
        const responseData:ResponseObject={statusCode:StatusCodes.OK, message: "campaigns returned successfully", data}
        return sendResponse(res, responseData)
    });

    public createCampaign = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const requestPayload = req.body
        const data = await this.campaignService.createCampaign(requestPayload)
        const responseData:ResponseObject={statusCode:StatusCodes.CREATED, message: "campaign created successfully", data}
        return sendResponse(res, responseData)
    });

    public getCampaignDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const campaignId = req.params.id
        const data = await this.campaignService.getCampaignDetails(campaignId, next)
        if(!data)return
        const responseData:ResponseObject={statusCode:StatusCodes.OK, message: "campaign details returned successfully", data}
        return sendResponse(res, responseData)
    });

    public getCampaignMetrics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const campaignId: string = req.params.id as unknown as string
        const data = await this.campaignService.getCampaignMetrics(campaignId, next)
        if(!data)return
        const responseData:ResponseObject={statusCode:StatusCodes.OK, message: "campaign metrics returned successfully", data}
        return sendResponse(res, responseData)
    });

    public deleteCampaign = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const campaignId = req.params.id
        const data = await this.campaignService.deleteCampaign(campaignId, next)
        if(!data)return
        const responseData:ResponseObject={statusCode:StatusCodes.NO_CONTENT}
        return sendResponse(res, responseData)
    });
}
