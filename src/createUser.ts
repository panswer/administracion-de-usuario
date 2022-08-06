import middy from '@middy/core';
import jsonBodyParse from '@middy/http-json-body-parser';
import cors from '@middy/http-cors';
import AWS from 'aws-sdk';
import { v4 } from 'uuid';

import { validateDataOfUser } from '../tools/user';
import { hashPassword } from '../tools/auth';

export interface User {
    id: string,
    email: string,
    username: string,
    firstname: string,
    lastname: string
    telephone: string,
    address: string,
    birthday: string,
    userRole: number,
    active: boolean,
    password?: string
}

const createUser = async (event) => {
    const dynamondb = new AWS.DynamoDB.DocumentClient();

    const data: User = event.body;
    data.active = false;

    const validation = validateDataOfUser(data);

    if (validation.ok && validation.user?.password) {
        const newUser = validation.user;
        newUser.id = v4();
        newUser.password = hashPassword(validation.user.password);

        await dynamondb.put({
            TableName: 'UsersTable',
            Item: newUser
        }).promise();

        delete newUser.password;

        return {
            statusCode: 201,
            body: JSON.stringify({
                ok: true,
                data: newUser
            })
        }
    } else {
        return {
            statusCode: 412,
            body: JSON.stringify({
                ok: false,
                message: validation.message
            })
        }
    }
}

export const handler = middy(createUser)
    .use(jsonBodyParse())
    .use(cors())