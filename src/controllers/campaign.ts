import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utilities/catch-async-error";
import CampaignService from "../services/campaign";
import { sendResponse } from "../utilities/responses.utilities";
import { PaginationObject, ResponseObject } from "../types";
import { StatusCodes } from "http-status-codes";
import { pagination } from "../utilities/global.utilities";
import { CampaignMessages } from "../constants/responses.constants";
import { createCampaign, getCampaignInsights, getCampaigns } from "../api/facebook";
import { CampaignErrors } from "../constants/errors.constants";


export default class CampaignController {
    constructor(private readonly campaignService: CampaignService) { }
    public getCampaigns = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const paginate: PaginationObject = pagination(req)
        const data = await this.campaignService.getCampaigns(paginate)
        const responseData: ResponseObject = { statusCode: StatusCodes.OK, message: CampaignMessages.CAMPAIGNS, data }
        const apiRes = await getCampaigns()
        if (!apiRes) responseData.meta = CampaignErrors.AD_PERMISSION_ERROR
        return sendResponse(res, responseData)
    });

    public createCampaign = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const requestPayload = req.body
        const data = await this.campaignService.createCampaign(requestPayload)
        const responseData: ResponseObject = { statusCode: StatusCodes.CREATED, message: CampaignMessages.CAMPAIGN_CREATED, data }
        const apiRes = await createCampaign(requestPayload)
        if (!apiRes) responseData.meta = CampaignErrors.AD_PERMISSION_ERROR
        return sendResponse(res, responseData)
    });

    public getCampaignDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const campaignId = req.params.id
        const data = await this.campaignService.getCampaignDetails(campaignId, next)
        if (!data) return
        const responseData: ResponseObject = { statusCode: StatusCodes.OK, message: CampaignMessages.CAMPAIGN_DETAILS, data }
        return sendResponse(res, responseData)
    });

    public getCampaignMetrics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const campaignId: string = req.params.id as unknown as string
        const data = await this.campaignService.getCampaignMetrics(campaignId, next)
        if (!data) return
        const responseData: ResponseObject = { statusCode: StatusCodes.OK, message: CampaignMessages.CAMPAIGN_METRICS, data }
        const apiRes = await getCampaignInsights(campaignId)
        if (!apiRes) responseData.meta = CampaignErrors.AD_PERMISSION_ERROR
        return sendResponse(res, responseData)
    });

    public deleteCampaign = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const campaignId = req.params.id
        const data = await this.campaignService.deleteCampaign(campaignId, next)
        if (!data) return
        const responseData: ResponseObject = { statusCode: StatusCodes.NO_CONTENT }
        return sendResponse(res, responseData)
    });
}
