var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID;

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

    checkUserIsInConversation(userID, conversation){
        return new Promise ( function(resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                var col = db.collection('conversations')
                //var objectID = 'ObjectId("' + conversation + '")'

                col.find({ 
                        $and: [
                            { '_id' : new ObjectId(conversation.toString()) }, 
                            {'users' : userID }
                        ] 
                    }).toArray(function(err, docs){
                        if (docs.length != 0){
                            resolve(docs)
                        } else {
                            reject("Not in conversation")
                        }
                    })
                db.close();
            });
        })
    }

    newMessage(userID, conversation, msg){
        return new Promise ( function(resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                var message = {
                    'userID' : userID,
                    'messsage' : msg
                }  

                var col = db.collection('conversations')
                col.update( 
                    { '_id' : new ObjectId(conversation.toString()) },
                    { $push : { 'messages' :  message } },
                    
                    function(err, add){
                        resolve('added')
                    }
                )
            })
        })
    }

    getAllUsers(){
        return new Promise ( function(resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                var col = db.collection('users')
                
                col.find({}).toArray(function(err, docs) {
                    resolve(docs)
                });                      
                db.close();
            });
        })
    }

    
}