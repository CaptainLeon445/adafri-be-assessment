import express from 'express';
import container from '../containers/container.global';
import { createCampaignValidator, idParamvalidator } from '../middlewares/validators/campaign';

const campaignRoutes = express.Router();
const campaignController = container.resolve('campaignController');

campaignRoutes.get("/", campaignController.getCampaigns)
campaignRoutes.get("/:id", idParamvalidator, campaignController.getCampaignDetails)
campaignRoutes.post("/create", createCampaignValidator, campaignController.createCampaign.bind(campaignController))
campaignRoutes.get("/:id/metrics",idParamvalidator, campaignController.getCampaignMetrics)
campaignRoutes.patch("/:id",idParamvalidator, campaignController.getCampaigns)
campaignRoutes.delete("/:id",idParamvalidator, campaignController.deleteCampaign)

export default campaignRoutes

