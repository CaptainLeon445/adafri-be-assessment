import { ContainerKeys } from './container.types';
import { ContainerInstanceTypes } from './container.interfaces';
import CampaignController from '../controllers/campaign';
import CampaignService from '../services/campaign';


class Container {
  private instances: Partial<Record<ContainerKeys, ContainerInstanceTypes[ContainerKeys]>> = {};

  register<K extends ContainerKeys>(key: K, instance: ContainerInstanceTypes[K]): void {
    this.instances[key] = instance;
  }

  resolve<K extends ContainerKeys>(key: K): ContainerInstanceTypes[K] {
    return this.instances[key] as ContainerInstanceTypes[K];
  }
}

const container = new Container();
container.register("campaignService", new CampaignService())
container.register("campaignController", new CampaignController(container.resolve('campaignService')))
export default container;
