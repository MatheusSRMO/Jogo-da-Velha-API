import Users from "../models/Users";
import { check_password, generate_token } from "../services/auth";


class UsersController {

    async login(request, response) {
        const { username, password } = request.body;
        
        const user = await Users.findOne({
            where: {
                username
            }
        });

        if (user && await check_password(user, password)) 
            return response.status(200).json({
                token: generate_token(user)
            })
        
        if (!user) {
            await Users.create({ username, password });
            const user = await Users.findOne({
                where: {
                    username
                }
            });
            return response.status(200).json({
                token: generate_token(user)
            })
        }

        return response.status(401).json();
    }
}

export default new UsersController();