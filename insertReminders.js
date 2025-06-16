const { MongoClient } = require("mongodb");
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_CONNECTION_STRING; 
if (!uri) {
    console.error("MONGODB_CONNECTION_STRING environment variable not set. Please create a .env file with your MongoDB connection string.");
    process.exit(1);
}
const client = new MongoClient(uri);

const remindersToPrepopulate = [
    {
        name: 'Drink water',
        time: '16:00',
        notified: false
    },
    {
        name: 'HIIT Cardio',
        time: '15:00',
        notified: false
    },
];

async function insertRemindersIntoDB() {
    let connection;
    try {
        connection = await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Connected successfully to server for data seeding.");

        const db = client.db("crud");
        const collection = db.collection("reminders"); 

        const remindersFormatted = remindersToPrepopulate.map(r => ({
            name: r.name,
            time: r.time,
            notified: r.notified
        }));

        const result = await collection.insertMany(remindersFormatted);
        console.log(`${result.insertedCount} initial reminders inserted.`);
    } catch (error) {
        console.error("Fatal error during reminder pre-population:", error);
        throw error; 
    } finally {
        if (connection) {
            await client.close();
            console.log("MongoDB connection closed for data seeding.");
        }
    }
}

insertRemindersIntoDB()
    .then(() => console.log("Reminder pre-population operation completed."))
    .catch((err) => {
        console.error("Fatal error during reminder pre-population:", err);
        process.exit(1);
    });