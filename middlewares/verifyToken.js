import jwt from 'jsonwebtoken';

function verifyToken(req, res, next) {
try{

    let token = req.header("Authorization");
        
    if(!token){
        res.send("Access Denied");
    }

    // remove Bearer from token
    if(token.startsWith("Bearer ")){
        token = token.slice(7 , token.length).trimLeft();
    }
    
    // jwt verification
    const decode = jwt.verify(token , process.env.JWT_PASSWORD);

    req.user = decode ;  
    next();

} catch (error){
    res.status(403).json(error);
}
}




export const isAdmin = async (req , res , next)=> {
    try{
        // check user role
        if(req.user.role !== "admin")
        {
            return res.send({
                success : false ,  
                message : "Unauthorized Access"
            });  
        }
        else{
            next();
        }
    } catch (error) {
        console.log(error); 
        res.send({
            success : false , 
            error ,
            message : "Error in admin middleware"
        })
    }
} 

export default verifyToken ;