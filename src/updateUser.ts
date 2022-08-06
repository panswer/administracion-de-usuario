import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import cors from '@middy/http-cors';
import AWS from 'aws-sdk';

import { validateDataOfUser } from '../tools/user';
import { hashPassword } from '../tools/auth';

const updateUserById = async (event) => {
    const dynamondb = new AWS.DynamoDB.DocumentClient();

    const { id } = event.pathParameters;
    const body = event.body;

    if (!id) {
        return {
            statusCode: 422,
            body: JSON.stringify({
                ok: false,
                message: "The user's id is required"
            })
        }
    }

    const validation = validateDataOfUser(body);

    if (!validation.ok) {
        return {
            statusCode: 412,
            body: JSON.stringify({
                ok: false,
                message: validation.message
            })
        }
    }

    const responsedb = await dynamondb.get({
        TableName: 'UsersTable',
        Key: {
            id
        }
    }).promise();


    if (responsedb.Item) {
        delete event.body.id;
        delete event.body.username;


        if (validation.user?.password)
            validation.user.password = hashPassword(validation.user?.password);

        await dynamondb.update({
            TableName: 'UsersTable',
            Key: {
                id
            },
            UpdateExpression: 'set email = :email, firstname = :firstname, lastname = :lastname, telephone = :telephone, address = :address, birthday = :birthday, userRole = :userRole, password = :password',
            ExpressionAttributeValues: {
                ':email': validation.user?.email,
                ':firstname': validation.user?.firstname,
                ':lastname': validation.user?.lastname,
                ':telephone': validation.user?.telephone,
                ':address': validation.user?.address,
                ':birthday': validation.user?.birthday,
                ':userRole': validation.user?.userRole,
                ':password': validation.user?.password
            }
        }).promise();

        delete responsedb.Item.password;
        delete event.body.password;

        return {
            statusCode: 200,
            body: JSON.stringify({
                ok: true,
                data: Object.assign({}, responsedb.Item, event.body)
            })
        }
    } else {
        return {
            statusCode: 412,
            body: JSON.stringify({
                ok: false,
                message: "The user is not registered"
            })
        }
    }

}


export const handler = middy(updateUserById)
    .use(jsonBodyParser())
    .use(cors());