import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpCors from "@middy/http-cors";
import AWS from 'aws-sdk';

interface Parameters {
    id?: string
}

const getUserById = async (event) => {
    const dynamondb = new AWS.DynamoDB.DocumentClient();
    const parameters: Parameters = event.pathParameters;

    if (!parameters?.id) {
        return {
            statusCode: 412,
            body: JSON.stringify({
                ok: false,
                message: "The id is required"
            })
        }
    }

    const result = await dynamondb.get({
        TableName: 'UsersTable',
        Key: {
            id: parameters.id
        }
    }).promise();

    delete result.Item?.password;

    if (result.Item) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                ok: true,
                data: result.Item
            })
        }
    } else {
        return {
            statusCode: 404,
            body: JSON.stringify({
                ok: false,
                message: "User by id is not registered"
            })
        }
    }

}

export const handler = middy(getUserById)
    .use(jsonBodyParser())
    .use(httpCors());