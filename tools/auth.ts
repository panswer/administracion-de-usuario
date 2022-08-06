import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../src/createUser';

const secret = 'lasvacasvuelan1234567890987654321';

export const hashPassword = (password: string): string => {
    const salt = bcrypt.genSaltSync();

    const hash = bcrypt.hashSync(password, salt);

    return hash;
}

export const verifyPassword = (password: string, hash: string): boolean => {
    const match = bcrypt.compareSync(password, hash);

    return match
}

export const getToken = (user): string => {

    const token = jwt.sign(user, secret, { expiresIn: '1d' });

    return token;
}

export const verifyToken = (token: string): User => {
    console.log(token);
    
    const payload = JSON.parse(JSON.stringify(jwt.verify(token, secret)));

    return {
        id: payload.id,
        firstname: payload.firstname,
        lastname: payload.lastname,
        userRole: payload.userRole,
        active: payload.active,
        address: payload.address,
        birthday: payload.birthday,
        email: payload.email,
        telephone: payload.telephone,
        username: payload.username
    };
}