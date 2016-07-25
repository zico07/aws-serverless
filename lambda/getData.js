'use strict';
console.log('Loading event');

var url = require('url');
var aws = require('aws-sdk');
var dynamo = new aws.DynamoDB.DocumentClient({region: 'ap-northeast-1'});
var tableName = "seminar";

exports.handler = function(event, context) {
        console.log('Received event:');
        //console.log(JSON.stringify(event, null, '  '));
        // Get the object from the event and show its content type
        
        //パラメータチェック
        if(event.plefix !== null && event.plefix !== ""){
            //パラメータと会社名カナの前方一致でscan
            dynamo.scan({
              TableName: tableName,
              FilterExpression:
                 "begins_with(company_kana, :tag) ",
              ExpressionAttributeValues: {
                ":tag": event.plefix
              }}, function (err, data) {
                    if (err) {
                        console.log(err,err.stack);
                        context.fail(err);
                    } else {
                        console.log(JSON.stringify({event: event, context: context}, null, 2));
                        context.succeed(data);
                    }
            });
        }else{
            //全件取得
            dynamo.scan({TableName: tableName}, function (err, data) {
                    if (err) {
                        console.log(err,err.stack);
                        context.fail(err);
                    } else {
                        console.log(JSON.stringify({event: event, context: context}, null, 2));
                        context.succeed(data);
                    }
            });
        }
};