# AWSでサーバレスアーキテクチャ

## 構成
一般的なよくある構成
APIGateway+Lambda+DynamoDB

APIはデータの取得、新規・更新、削除の機能があってそれぞれLambdaにつながっている。
DBは2テーブルで下記の構成

データ用

```
{
  "company_kana": "アー",
  "company_name": "アー",
  "id": 8,
  "staff_name": "アー"
}
```

IDのシーケンス発行用

```
{
  "current_number": 18,
  "name": "seminar_sequences"
}
```
## Lambda
### データを取得する
 + ファイル名：getData.js
 + 処理：APIGatewayのGETでplefixというパラメータを取得して、company_kanaの前方一致でscanした結果を返す。
 パラメータが無ければ全件検索

### データを作成・更新する
 + ファイル名：editData.js
 + 処理：POSTされたeventからパラメータを取得しDynamoDBにputItemする

 ※idがあればupdateなければinsertになる

### データを削除する
  + ファイル名：deleteData.js
  + 処理：POSTされたeventからidのパラメータを取得しDynamoDBにdeleteItemする

## APIGateway
### データ取得APIの作成
データ取得のリソースを作成して、GETメソッドを作成。lambdaのgetDataをエンドポイントにする

### データ更新作成APIの作成
データ取得のリソースを作成して、GETメソッドを作成。lambdaのeditDataをエンドポイントにする

### データ削除APIの作成
データ取得のリソースを作成して、GETメソッドを作成。lambdaのdeleteDataをエンドポイントにする

###API全体の設定
 + CORSを有効化
 + APIキーの発行

## 画面
管理する画面を作成
 + ファイル名：admin.html
 riot.jsとbootstrapを使ってSPAで管理

 ※コンポーネントを分けていないがとりあえず
