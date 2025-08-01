import jwt from "jsonwebtoken";

const isAuthenticated = async(req,res,next)=>{
    try {
        const  token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message:"user not authenticated --isAuthenticated middleware",
                success:false
            });
        }
        const decode = jwt.verify(token,process.env.SECRET_KEY)

        if (!decode) {
            return res.status(401).json({
                message:"invalid token --isAuthenticated middleware",
                success:false
            });
        }

        req.id = decode.userId;
        next();

    } catch (error) {
        console.log(error);
        
    }
}

export default isAuthenticated;