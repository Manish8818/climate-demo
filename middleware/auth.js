const jwt= require("jsonwebtoken");
const User= require("../schema/user");


const auth = async(req,res,next)=>{

    try {const token= req.cookies.jwt;
        const verifyUser=  jwt.verify(token,process.env.KEY);
        // console.log(verifyUser);
        
       
        const User= require("../schema/user");
       const data= await User.findOne({_id:verifyUser._id});
        console.log(data);
        next();
       
    } catch (error) {
        res.send(error);   
    }
    
}
module.exports=auth;

