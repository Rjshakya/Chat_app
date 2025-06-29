import { RequestHandler } from "express";
import User from "../../models/user.model.js";


export const getUserProfilePic:RequestHandler = async ( req, res) => {
    
    try {
        const userID = req?.query?.id

        if(!userID){
           res.status(406).json({
            success:false,
            error:true,
            msg:'no user id found'
           })

           return;
        }

        const user = await User.findById(userID)
        if(!user){
            res.status(404).json({
                success:false,
                error:true,
                msg:'no user found '
            })
        }

        res.status(200).json({
            success:true,
            pic:user?.picture,
            msg:'user picture',
            user
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            error:true,
            msg:'server error'
        })
        
    }
}