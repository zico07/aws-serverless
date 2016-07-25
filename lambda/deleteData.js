'use strict';
console.log('Loading event');

var url = require('url');
var aws = require('aws-sdk');
var dynamo = new aws.DynamoDB({region: 'ap-northeast-1'});
var tableName = "seminar";

exports.handler = function(event, context) {
        console.log('Received event:');
        //console.log(JSON.stringify(event, null, '  '));
        // Get the object from the event and show its content type
        //ÉfÅ[É^çÌèú
         dynamo.deleteItem({
                TableName: tableName,
                Key : {
                    "id": {"N": event.id }
                    }
                }, function(err, data) {
                    if (err) {
                        console.log(err,err.stack);
                        context.fail('error','putting item into dynamodb failed: '+err);
                    }
                    else {
                        console.log('great success: '+JSON.stringify(data, null, '  '));
                        context.done('success');
                    }
                });
};