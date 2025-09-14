import { MongoClient, Db } from 'mongodb'

let client: MongoClient
let clientPromise: Promise<MongoClient>

function getMongoClient(): Promise<MongoClient> {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local')
  }

  const uri = process.env.MONGODB_URI
  const options = {}

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    return globalWithMongo._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    if (!clientPromise) {
      client = new MongoClient(uri, options)
      clientPromise = client.connect()
    }
    return clientPromise
  }
}

export default getMongoClient

export async function getDatabase(): Promise<Db> {
  const client = await getMongoClient()
  return client.db('ecocred')
}
