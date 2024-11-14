import express from 'express';
import container from '../containers/container.global';

const accessKeyRouter = express.Router();
const accessKeyController = container.resolve('accessKeyController');

accessKeyRouter.get('/', accessKeyController.getAccessKeys.bind(accessKeyController));
accessKeyRouter.post('/', accessKeyController.createAccessKeys.bind(accessKeyController));
accessKeyRouter.post('/reset', accessKeyController.resetAccessKeys.bind(accessKeyController));

export default accessKeyRouter;
