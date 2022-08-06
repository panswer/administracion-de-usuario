import middy from '@middy/core';
import jsonBodyParse from '@middy/http-json-body-parser';
import cors from '@middy/http-cors';
import AWS from 'aws-sdk';

import { verifyToken } from '../tools/auth';

const getUsers = async (event, context) => {
    const dynamondb = new AWS.DynamoDB.DocumentClient();
    const authorization: string | undefined = event.headers?.authorization?.split(' ');

    if (!authorization) {
        return {
            statusCode: 401,
            body: JSON.stringify({
                ok: false,
                message: "Without authorization"
            })
        }
    }

    const payload = verifyToken(authorization[1]);

    if(payload.userRole === 1000){
        const nextPage = event.queryStringParameters?.next;
    
        let ressult;
    
        if (nextPage) {
            ressult = await dynamondb.scan({
                TableName: 'UsersTable',
                ExclusiveStartKey: nextPage
            }).promise();
        } else {
            ressult = await dynamondb.scan({
                TableName: 'UsersTable'
            }).promise();
        }
    
        let response = ressult.Items;
    
        return {
            statusCode: 200,
            body: JSON.stringify({
                ok: true,
                data: response?.map(user => {
                    let answer = user;
                    delete answer.password;
    
                    return answer;
                }),
                withNext: ressult.LastEvaluatedKey
            })
        };
    }else{
        return {
            statusCode: 401,
            body: JSON.stringify({
                ok: false,
                message: "Without authorization"
            })
        }
    }
}


export const handler = middy(getUsers)
    .use(jsonBodyParse())
    .use(cors());