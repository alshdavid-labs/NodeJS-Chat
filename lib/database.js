var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/chat';

module.exports  = class Database {
    constructor(){}

    test(){
        return new Promise ( function(resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                var col = db.collection('conversations')

                col.find({}).toArray(function(err, docs) {
                    resolve(docs)
                });      
                
                db.close();
            });
        })
    }


    loginUser(username){

    }
}