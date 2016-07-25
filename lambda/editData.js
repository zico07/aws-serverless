'use strict';
console.log('Loading event');

var url = require('url');
var aws = require('aws-sdk');
var dynamo = new aws.DynamoDB({region: 'ap-northeast-1'});
var tableName = "seminar";
var sequencestableName = "seminar_sequences";

exports.handler = function(event, context) {
        console.log('Received event:');
        //console.log(JSON.stringify(event, null, '  '));
        // Get the object from the event and show its content type
        var item = {};
        //idの有無を判別
        if(event.id !== undefined && event.id !== null && event.id !== ""){
            item.id= {"N": event.id};
            //更新処理へ
            update(item,context,event);
        }else{
            //新規IDをシーケンステーブルから取得
            var paramsid = {
                    TableName: sequencestableName,
                    KeyConditionExpression: "#dt = :Id",
                    ExpressionAttributeValues:{
                         ":Id":{"S":"seminar_sequences"}
                    },
                    ExpressionAttributeNames : {
                        "#dt"  : 'name'
                    }
            };
            dynamo.query(paramsid, function(err, data){
                if (err) {
                    console.log(err, err.stack);
                    context.fail(err);
                } else {
                    //ID付番
                    item.id= {"N": data.Items[0].current_number.N};
                     var params = {
                        TableName: sequencestableName,
                        Key: {name:{S:'seminar_sequences'}},
                        AttributeUpdates:{
                            current_number:{
                                Action: 'ADD',
                                Value:{N:"1"}
                            }
                        },
                        ReturnValues: 'UPDATED_NEW'
                    };
                    //シーケンスを更新
                    dynamo.updateItem(params, function(err, data){
                        if (err) {
                            console.log(err, err.stack);
                            context.fail(err);
                        } else {
                            //更新処理へ
                            update(item,context,event);
                        }
                    });
                    
                }
            });
        }
         
};

//更新処理
function update(item,context,event){
        //各パラメータチェック。あれば設定
        if(event.company_kana !== undefined && event.company_kana !== null && event.company_kana !== ""){
            item.company_kana= {"S": event.company_kana};
        }
        if(event.company_name !== undefined && event.company_name !== null && event.company_name !== ""){
            item.company_name= {"S": event.company_name};
        }
        if(event.staff_name !== undefined && event.staff_name !== null && event.staff_name !== ""){
            item.staff_name= {"S": event.staff_name};
        }
        if( event.join1 !== undefined && event.join1 !== null && event.join1 !== ""){
            item.join1= {"B": event.join1};
        }
        if( event.join2 !== undefined && event.join2 !== null && event.join2 !== ""){
            item.join2= {"B": event.join2};
        }
        if( event.join3 !== undefined && event.join3 !== null && event.join3 !== ""){
            item.join3= {"B": event.join3};
        }
        if( event.join4 !== undefined && event.join4 !== null && event.join4 !== ""){
            item.join4= {"B": event.join4};
        }
        var params = {
            TableName: tableName,
            Item: item
        };
        
        dynamo.putItem(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
                context.fail(err);
            } else {
                context.succeed('OK');
            }
        });
}