import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { sendMessage,getMessage ,getConversation} from "../controllers/messageController.js";


const router = express.Router();


router.get('/conversations', protectRoute,getConversation);   
router.post('/', protectRoute,sendMessage);   
router.get('/:ortherUserId', protectRoute,getMessage);   


export default router;
