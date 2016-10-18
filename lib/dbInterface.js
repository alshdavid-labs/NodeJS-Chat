const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/chat';

module.exports = class Data {
    constructor(){}

    find(query, location){
        return new Promise ( function(resolve, reject) {
            MongoClient.connect(url, (err, db) => 
            {
                db.collection(location)
                    .find(query)
                        .toArray((err, docs) => 
                        {
                            if (err) {
                                reject(err)
                            } else {
                                resolve(docs)
                            }
                        });      
                db.close();
            });
        })
    }

    insert(query, location){
        return new Promise ( function(resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                db.collection(location).
                    col.insert( query, (err, docs) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(docs.ops)
                        }
                    })
                db.close();
            });
        })
    }

    distinct(where, query, location){
        return new Promise ( function(resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                db.collection(location).
                    col.distinct( where, query, (err, docs) => 
                        { 
                            if (err) {
                                reject(err)
                            } else {
                                resolve(docs)
                            } 
                        });                       
                db.close();
            });
        })
    }
    
}