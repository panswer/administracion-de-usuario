import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import cors from '@middy/http-cors';
import AWS from 'aws-sdk';

import { getToken, verifyPassword } from '../tools/auth';
import { User } from 'aws-sdk/clients/budgets';

const signIn = async (event) => {
    const dynamondb = new AWS.DynamoDB.DocumentClient();
    const body = event.body;
    if (!body.username) {
        return {
            statusCode: 412,
            body: JSON.stringify({
                ok: false,
                message: "The username is required"
            })
        }
    }

    if (!body.password) {
        return {
            statusCode: 412,
            body: JSON.stringify({
                ok: false,
                message: "The password is required"
            })
        }
    }

    const result = await dynamondb.scan({
        TableName: 'UsersTable'
    }).promise();
    console.log(body.username);

    const user = result.Items?.filter(user => user.username === body.username).pop();
    console.log(user);

    if (user && user.password) {
        const passwordValidate = verifyPassword(body.password, user.password);

        if (passwordValidate) {

            const token = getToken(user);

            return {
                statusCode: 200,
                body: JSON.stringify({
                    ok: true,
                    token: token,
                    role: user.userRole
                })
            }
        }
    }

    return {
        statusCode: 401,
        body: JSON.stringify({
            ok: false,
            message: "The username or password is not validate"
        })
    }
}

export const handler = middy(signIn)
    .use(jsonBodyParser())
    .use(cors());