const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/chat';

const Data = require('./dbInterface')
const data = new Data

const users = "users"
const conversations = "conversations"

module.exports = class Database {

    getUserDetails(email) {
        const query = {
            'email' : email
        }
        return new Promise ((resolve, reject) =>{
            data.find(query, users).then( res => {
                if (res.length == 1) { resolve( res[0] )}
                else { reject( "No Users Match That" )}
            })
        })
        
        
        
    }

    getConversations(userID) {
        const query = { 
            "users" : userID 
        }
        return data.find(query, conversations)
    }

    getAllUsers() {
        const query = {}
        return data.find(query, users)
    }


    checkExistingConversation(userIDs){
        return new Promise ( function(resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                var col = db.collection('conversations')
                col.distinct( 
                    "users", {
                        users : {
                            $all : userIDs
                        }
                    }, (err, docs) => { 
                        resolve(docs.length) 
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
                col.insert( conversation, function(err, docs){
                    resolve(docs.ops)

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
                    'message' : msg
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

    
    getIdFromName(){
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

    userUniqueEmail(email){
        return new Promise ( function(resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                var col = db.collection('users')

                col.find({ "email" : email }).toArray(function(err, docs) {
                    resolve(docs)
                });      
                
                db.close();
            });
        })
    }

    createUser(email, username){
        return new Promise ( function(resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                var col = db.collection('users')
                var user = {
                    'email' : email,
                    'username' : username 
                }
                col.insert( user, function(err, docs){
                    resolve(docs.ops)
                } )
                db.close();
            });
        })
    }

    
}



