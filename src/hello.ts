"use strict";

import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import middy from '@middy/core';
import jsonBodyParse from '@middy/http-json-body-parser';
import cors from '@middy/http-cors';

export const handler: APIGatewayProxyHandler = middy(async (event: APIGatewayProxyEvent) => {

  return {
    statusCode: 200,
    body: JSON.stringify({ 'data': "hello world!" })
  };
})
  .use(jsonBodyParse())
  .use(cors());
