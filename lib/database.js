var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/chat';

module.exports  = class Database {
    constructor(){}

    getUserDetails(username){
        return new Promise ( function(resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                var col = db.collection('users')

                col.find({ "username" : username }).toArray(function(err, docs) {
                    resolve(docs)
                    //this.getConversations(docs[0]._id)
                });      
                
                db.close();
            });
        })
    }

    getConversations(userID){
        return new Promise ( function(resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                var col = db.collection('conversations')
                
                col.find({ "users" : userID.toString() }).toArray(function(err, docs) {
                    resolve(docs)
                    //console.log(docs)
                });                      
                db.close();
            });
        })
    }

    getRecent(conversation){
        return new Promise ( function(resolve, reject) {
            
        })
    }

    createConversation(userIDs){
        return new Promise ( function(resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                var col = db.collection('conversations')
                var conversation = {
                    users : userIDs,
                    messages : []
                }
                col.insert( conversation, function(){
                    resolve(true)
                } )
                db.close();
            });
        })
    }
}