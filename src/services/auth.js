import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config_jwt from '../config/auth';

export const create_password_hash = async password => bcrypt.hash(password, 8);

export const check_password = async (user, password) => await bcrypt.compare(password, user.password);


export const generate_token = user => jwt.sign({
        id: user.id,
        username: user.username
    }, config_jwt.SECRET_KEY, { expiresIn: "1d" }
);

export const verify_token = token => {
    return jwt.decode(token, config_jwt.SECRET_KEY);
}
