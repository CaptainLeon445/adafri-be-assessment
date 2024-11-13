import { NextFunction } from "express";
import Campaign from "../models/campaign";
import { getMetrics } from "../api/twitter";
import { StatusCodes } from "http-status-codes";
import { getErrorMessage } from "../middlewares/error_handlers/global-handler";
import { PaginationObject } from "../types";
import { CampaignErrors } from "../constants/errors.constants";


export default class CampaignService {

    public getCampaigns = (async (paginate: PaginationObject) => {
        try {
            const responseData = await Campaign.findAndCountAll({ where: { ...paginate } });
            const { rows, count } = responseData
            const data = { count, data: rows }
            return data
        } catch (error) {

        }
    });

    public createCampaign = (async (payload) => {
        try {
            const data = await Campaign.create(payload);
            return data
        } catch (error) {

        }
    });

    public getCampaignDetails = (async (campaignId: string, next: NextFunction) => {
        try {
            const data = await Campaign.findByPk(campaignId)
            if (!data) return getErrorMessage(next, CampaignErrors.NOT_FOUND, StatusCodes.NOT_FOUND)
            return data
        } catch (error) {

        }
    });

    public getCampaignMetrics = (async (campaignId: string, next: NextFunction) => {
        try {
            const campaign = await Campaign.findByPk(campaignId)
            if (!campaign) return getErrorMessage(next, CampaignErrors.NOT_FOUND, StatusCodes.NOT_FOUND)
            const metrics = await getMetrics(campaignId)
            const data = { campaign, metrics }
            return data
        } catch (error) {

        }
    });

    public deleteCampaign = async (campaignId: string, next: NextFunction) => {
        try {
            const data = await Campaign.destroy({ where: { id: campaignId } })
            if (!data) return getErrorMessage(next, CampaignErrors.NOT_FOUND, StatusCodes.NOT_FOUND)
            return data
        } catch (error) {

        }
    };
}
