import pkg from 'jsonwebtoken'
const{verify} = pkg
export default async function Auth(req,res,next) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if(!token)
            return res.status(401).json({msg:'Login to continue'})
        const auth = await verify(token,process.env.JWT_SECRET_KEY)
        console.log(auth);
        req.user=auth
        next()
        
    } catch (error) {
        return res.status(401).json({msg:'Login to continue'})
    }
}