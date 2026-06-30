import * as shopController from '../controller/shopController.js';
import { Router } from 'express';
const shopRouter = Router();

shopRouter.get('/items', shopController.getItems);

shopRouter.post('/buy/:id', shopController.buyItem);

export default shopRouter