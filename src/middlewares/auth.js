import { verify_token } from '../services/auth';
import Users from '../models/Users';

const private_route = async (request, response, next) => {
    const authHeader = request.headers.authorization;
    
    if (!authHeader)
        return response.status(400).json({ message: "Token is required!" })

    const [, token] = authHeader.split(" ")

    if (!token)
        return response.status(400).json({ message: "Token is invalid!" });

    try {
        const { id } = verify_token(token);
        
        const user = await Users.findByPk(id);
        
        if(user) {
            request.user_id = id;
            next();
        }
        else {
            return response.status(401).json();
        }
    } catch (e) {
        return response.status(500).json();
    }
}

export default private_route;