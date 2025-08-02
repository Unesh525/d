// lib/mongodb.js
import { MongoClient } from "mongodb";

if(!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing Environment variable: "MONGODB_URI');
}

const uri = process.env.MONGODB_URI
const option = {}

let client
let clientPromise

if(process.env.NODE_ENV === "development" ) {
    // in development mode , use a global variable so that the value is preserved across module reloads caused by HMR (hot module replacement)

    if(!global._mongoClientPromise){
        client = new MongoClient(uri, option)
        global._mongoClientPromise = client.connect()
    }

    clientPromise = global._mongoClientPromise
}
else{
    client = new MongoClient(uri, option)
    clientPromise = client.connect()
}

// export a module scoped mongoClient promise by this , it is a separate module , the client can be shared across function

export default clientPromise;