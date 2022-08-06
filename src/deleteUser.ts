import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import cors from '@middy/http-cors';
import AWS from 'aws-sdk';

const deleteUserById = async (event) => {
    const dynamondb = new AWS.DynamoDB.DocumentClient();

    const { ids } = event.body;

    if (ids instanceof Array && ids.length > 0) {
        let deleted = await Promise.all(ids.map(async (id) => {
            try {
                await dynamondb.delete({
                    TableName: 'UsersTable',
                    Key: {
                        id
                    }
                }).promise();

                return true;

            } catch (error) {
                console.log(error);
                return false;
            }
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({
                ok: true,
                deleted: ids.filter((id, i) => deleted[i] ? id : false)
            })
        }
    } else {
        return {
            statusCode: 422,
            body: JSON.stringify({
                ok: false,
                message: "It's required an user's id"
            })
        }
    }
}

export const handler = middy(deleteUserById)
    .use(jsonBodyParser())
    .use(cors());