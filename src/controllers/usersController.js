import Users from "../models/Users";
import { create_password_hash, check_password } from "../services/auth";


class UsersController {

    async create(request, response) {
        const { username, password } = request.body;

        if (!( username && password) ) 
            return response.status(400).json({
                message: "Passa os dados né animal"
            });
            
        const password_hash = await create_password_hash(password);
        await Users.create({ username, password: password_hash });

        return response.status(201).json({
            message: "Usuário criado com sucesso."
        });
    }

    async delete(request, response) {
        const { password } = request.body;
        const { id } = request.user_id;

        const user = await Users.findByPk(id);

        if (!user)
            return response.status(400).json();

        if (!(await check_password(user, password))) 
            return response.status(401).json({
                message: "Senha invalida!"
            });

        await Users.destroy({
            where: {
                id
            }
        });

        return response.status(200).json({
            message: "Usuario deletado com sucesso."
        });
    }

    async get_score(request, response) {
        try { 
            const user = await Users.findByPk(request.user_id);

            return response.status(200).json({ score: user.score })
        } catch (e) {
            return response.status(500).json()
        }
    }

}

export default new UsersController();
