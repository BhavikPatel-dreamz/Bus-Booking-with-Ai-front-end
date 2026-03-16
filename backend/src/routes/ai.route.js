import { Router } from 'express'
import { aiAllBus } from '../controllers/ai.controller.js'


const aiRouter = Router()

aiRouter.route('/getbus').post(aiAllBus)

export default aiRouter