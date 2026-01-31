import { Router } from "express";
import * as rh from "../requestHandler.js";
import auth from "../middlewares/auth.js"
// import multer from "multer";
// import path from 'path'

// const storage = multer.diskStorage({
//     destination:'./uploads',
//     filename:function(req,file,cb){
//         console.log(file,'multer');
        
//         const uniquesuffix = Date.now()+'-'+Math.round(Math.random() * 1E6)
//         cb(null,path.parse(file.originalname).name + '-'+ uniquesuffix+path.extname(file.originalname))
//     }
// })

// const upload = multer({
//     storage:storage
// })
const router = Router();

router.post("/registeremail", rh.registerEmail);
router.post("/verifyotp", rh.verifyOtp);
// router.route('/signup').post(upload.single('file'),rh.signup)
router.post("/signup", rh.signup);
router.post("/signin", rh.signin);
router.get("/me", auth, rh.getMe);
router.get("/users", auth, rh.getAllUsers);
router.post("/sendrequest", auth, rh.sendRequest);
router.post("/acceptrequest", auth, rh.acceptRequest);
router.get("/friends", auth, rh.getFriends);
router.get("/requests", auth, rh.getRequests);

export default router;
