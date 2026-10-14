import jwt from "jsonwebtoken"


function authMiddleware(req,res,next){


    try {
const authHeader = req.headers.authorization;
if(!authHeader){
     return res.status(401).json({
            msg:"Authorization header missing"
        });
}
const [token,type] = authHeader.split(" ")
if(!token && type !== "Bearer"){
    return res.status(401).json({
         msg:"Token missing"
    })
}

const decoded = jwt.verify(
    token,
    process.env.SECRET
)
req.user = decoded;
    console.log("DECODED:", decoded);
next()        
    } catch (error) {
    
        console.log(error);

    return res.status(401).json({
        msg:"Invalid token"
    });
      
    }

}


export default authMiddleware

