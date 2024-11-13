import CampaignController from '../controllers/campaign';
import CampaignService from '../services/campaign';

export interface ContainerInstanceTypes {
  campaignController: CampaignController;
  campaignService: CampaignService
}
