import express from 'express';
import container from '../containers/container.global';
import { createCampaignValidator, idParamvalidator } from '../middlewares/validators/campaign';
import { authRestrictTo } from '../middlewares/auth/auth.middleware';
import { ROLES } from '../constants/values.constants';

const campaignRoutes = express.Router();
const campaignController = container.resolve('campaignController');

campaignRoutes.get("/", campaignController.getCampaigns.bind(campaignController))
campaignRoutes.get("/:id", idParamvalidator, campaignController.getCampaignDetails.bind(campaignController))
campaignRoutes.post("/create", authRestrictTo([ROLES.admin]), createCampaignValidator, campaignController.createCampaign.bind(campaignController))
campaignRoutes.get("/:id/metrics", authRestrictTo([ROLES.admin]), idParamvalidator, campaignController.getCampaignMetrics.bind(campaignController))
campaignRoutes.patch("/:id", authRestrictTo([ROLES.admin]), idParamvalidator, campaignController.updateCampaign.bind(campaignController))
campaignRoutes.delete("/:id", authRestrictTo([ROLES.admin]), idParamvalidator, campaignController.deleteCampaign.bind(campaignController))

export default campaignRoutes

