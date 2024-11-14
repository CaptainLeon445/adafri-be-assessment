import { NextFunction } from "express";
import Campaign from "../models/campaign";
import { getMetrics } from "../api/twitter";
import { StatusCodes } from "http-status-codes";
import { getErrorMessage } from "../middlewares/error_handlers/global-handler";
import { PaginationObject } from "../types";
import { CampaignErrors } from "../constants/errors.constants";
import { getUpdatedFields } from "../utilities/global.utilities";


export default class CampaignService {
    public getCampaignById = (async (campaignId: string, next: NextFunction) => {
        try {
            const data = await Campaign.findOne({ where: { campaignId }, attributes:{exclude: ['id']}  })
            if (!data) return getErrorMessage(next, CampaignErrors.NOT_FOUND, StatusCodes.NOT_FOUND)
            return data
        } catch (error) {
            return getErrorMessage(next, "An error occurred", StatusCodes.INTERNAL_SERVER_ERROR)
        }
    });

    public getCampaigns = (async (paginate: PaginationObject, next: NextFunction) => {
        try {
            const responseData = await Campaign.findAndCountAll({ ...paginate, attributes:{exclude: ['id']} });
            const { rows, count } = responseData
            const data = { count, data: rows }
            return data
        } catch (error) {
            return getErrorMessage(next, "An error occurred", StatusCodes.INTERNAL_SERVER_ERROR)
        }
    });

    public createCampaign = (async (payload, next: NextFunction) => {
        try {
            const data = await Campaign.create(payload);
            return data
        } catch (error) {
            return getErrorMessage(next, "An error occurred", StatusCodes.INTERNAL_SERVER_ERROR)
        }
    });

    public updateCampaign = (async (campaignId: string, data, next: NextFunction) => {
        try {
            const campaign = await this.getCampaignById(campaignId, next)
            if (!campaign) return getErrorMessage(next, CampaignErrors.NOT_FOUND, StatusCodes.NOT_FOUND)
            const updatedFields = getUpdatedFields(campaign.toJSON(), data);
            if (Object.keys(updatedFields).length > 0) {
                const campaign=await Campaign.update(updatedFields, {where:{campaignId}, returning:true})
                return campaign[1][0]
            }
            return campaign
        } catch (error) {
            return getErrorMessage(next, "An error occurred", StatusCodes.INTERNAL_SERVER_ERROR)
        }
    });

    public getCampaignDetails = (async (campaignId: string, next: NextFunction) => {
        try {
            const data = await this.getCampaignById(campaignId, next)
            if (!data) return getErrorMessage(next, CampaignErrors.NOT_FOUND, StatusCodes.NOT_FOUND)
            return data
        } catch (error) {
            return getErrorMessage(next, "An error occurred", StatusCodes.INTERNAL_SERVER_ERROR)
        }
    });

    public getCampaignMetrics = (async (campaignId: string, next: NextFunction) => {
        try {
            const campaign = await this.getCampaignById(campaignId, next)
            if (!campaign) return getErrorMessage(next, CampaignErrors.NOT_FOUND, StatusCodes.NOT_FOUND)
            // const metrics = await getMetrics(campaignId)
            const data = { campaign, metrics: "checked" }
            return data
        } catch (error) {
            return getErrorMessage(next, "An error occurred", StatusCodes.INTERNAL_SERVER_ERROR)
        }
    });

    public deleteCampaign = async (campaignId: string, next: NextFunction) => {
        try {
            const data = await Campaign.destroy({ where: { id: campaignId } })
            if (!data) return getErrorMessage(next, CampaignErrors.NOT_FOUND, StatusCodes.NOT_FOUND)
            return data
        } catch (error) {
            return getErrorMessage(next, "An error occurred", StatusCodes.INTERNAL_SERVER_ERROR)
        }
    };
}
