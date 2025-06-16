const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' }); 

const MONGO_URI = process.env.MONGODB_CONNECTION_STRING; 
const DB_NAME = process.env.DB_NAME;

if (!MONGO_URI) {
    console.error("MONGO_URI environment variable not set. Please create a .env file with your MongoDB connection string.");
    process.exit(1);
}

const client = new MongoClient(MONGO_URI);

const SAMPLE_USER_ID = new ObjectId("60c728ef950549001c9b6789");
const sampleProgressData = [
    {
        "user_id": SAMPLE_USER_ID,
        "date_recorded": new Date("2025-01-15T09:00:00.000Z"),
        "weight": 80.5, "height": 170, "steps": 6500, "active_time": 45, "calories": 2000,
        "createdAt": new Date("2025-01-15T09:00:00.000Z"),
        "updatedAt": new Date("2025-01-15T09:00:00.000Z"),
    },
    {
        "user_id": SAMPLE_USER_ID,
        "date_recorded": new Date("2025-02-20T10:00:00.000Z"),
        "weight": 79.8, "height": 170, "steps": 7000, "active_time": 50, "calories": 2100,
        "createdAt": new Date("2025-02-20T10:00:00.000Z"),
        "updatedAt": new Date("2025-02-20T10:00:00.000Z"),
    },
    {
        "user_id": SAMPLE_USER_ID,
        "date_recorded": new Date("2025-03-06T11:00:00.000Z"), 
        "weight": 75.0, "height": 170, "steps": 7200, "active_time": 55, "calories": 2200,
        "createdAt": new Date("2025-03-06T11:00:00.000Z"),
        "updatedAt": new Date("2025-03-06T11:00:00.000Z"),
    },
    {
        "user_id": SAMPLE_USER_ID,
        "date_recorded": new Date("2025-03-29T14:30:00.000Z"), 
        "weight": 78.0, "height": 170, "steps": 8000, "active_time": 60, "calories": 2500,
        "createdAt": new Date("2025-03-29T14:30:00.000Z"),
        "updatedAt": new Date("2025-03-29T14:30:00.000Z"),
    },
    {
        "user_id": SAMPLE_USER_ID,
        "date_recorded": new Date("2025-04-10T12:00:00.000Z"),
        "weight": 77.0, "height": 170, "steps": 7800, "active_time": 58, "calories": 2350,
        "createdAt": new Date("2025-04-10T12:00:00.000Z"),
        "updatedAt": new Date("2025-04-10T12:00:00.000Z"),
    },
    {
        "user_id": SAMPLE_USER_ID,
        "date_recorded": new Date("2025-05-05T08:00:00.000Z"),
        "weight": 76.5, "height": 170, "steps": 7100, "active_time": 52, "calories": 2150,
        "createdAt": new Date("2025-05-05T08:00:00.000Z"),
        "updatedAt": new Date("2025-05-05T08:00:00.000Z"),
    },
    {
        "user_id": SAMPLE_USER_ID,
        "date_recorded": new Date("2025-06-09T16:00:00.000Z"),
        "weight": 75.0, "height": 170, "steps": 7500, "active_time": 90, "calories": 2200,
        "createdAt": new Date("2025-06-10T02:56:59.215Z"), 
        "updatedAt": new Date("2025-06-10T04:08:33.871Z"), 
    },
    {
        "user_id": SAMPLE_USER_ID,
        "date_recorded": new Date("2025-07-01T08:00:00.000Z"),
        "weight": 74.5, "height": 170, "steps": 7300, "active_time": 50, "calories": 2180,
        "createdAt": new Date("2025-07-01T08:00:00.000Z"),
        "updatedAt": new Date("2025-07-01T08:00:00.000Z"),
    },
];

async function insertWeightsIntoDB() {
    let connection;
    try {
        connection = await client.connect();
        // Ping the server to confirm connection
        await client.db("admin").command({ ping: 1 });
        console.log("Connected successfully to server for data seeding.");

        const db = client.db(DB_NAME); // Get the database instance
        const progressCollection = db.collection("progress"); // Get the progress collection
        const weightChangeCollection = db.collection("weightChange"); // Get the weightChange collection
        console.log("\n--- Inserting Progress Data ---");
        let insertedProgressCount = 0;
        for (const doc of sampleProgressData) {
            try {
                // Check for existing document to avoid duplicates if running multiple times
                const existingDoc = await progressCollection.findOne({
                    user_id: doc.user_id,
                    date_recorded: doc.date_recorded
                });

                if (!existingDoc) {
                    await progressCollection.insertOne(doc);
                    insertedProgressCount++;
                    console.log(`Inserted progress for ${doc.date_recorded.toISOString().split('T')[0]}`);
                } else {
                    console.log(`Skipping existing progress entry for ${doc.user_id} on ${doc.date_recorded.toISOString().split('T')[0]}`);
                }
            } catch (error) {
                if (error.code === 11000) { // Duplicate key error
                    console.warn(`Duplicate key error: Progress entry for ${doc.user_id} on ${doc.date_recorded.toISOString().split('T')[0]} already exists.`);
                } else {
                    console.error(`Error inserting progress document: ${error.message}`);
                }
            }
        }
        console.log(`Inserted ${insertedProgressCount} new progress documents.`);

        console.log("\n--- Upserting Weight Change Data (Latest per Month) ---");
        const sortedProgressData = [...sampleProgressData].sort((a, b) => a.date_recorded - b.date_recorded);

        for (const record of sortedProgressData) {
            const year = record.date_recorded.getFullYear();
            const month = record.date_recorded.getMonth() + 1; // getMonth() is 0-indexed

            const filterQuery = { "user_id": record.user_id, "year": year, "month": month };

            const existingWeightChange = await weightChangeCollection.findOne(filterQuery);

            if (existingWeightChange) {
                // If document exists, update only if the new record is *later*
                if (record.date_recorded > existingWeightChange.latest_date_recorded) {
                    await weightChangeCollection.updateOne(
                        { _id: existingWeightChange._id }, // Filter by _id for exact update
                        {
                            "$set": {
                                "latest_weight": record.weight,
                                "latest_date_recorded": record.date_recorded,
                                "updatedAt": new Date() // Update timestamp
                            }
                        }
                    );
                    console.log(`Upserted: Updated latest weight for ${year}-${month} to ${record.weight}kg (recorded on ${record.date_recorded.toISOString().split('T')[0]}).`);
                } else {
                    console.log(`Upserted: Skipping weight record for ${year}-${month} (${record.weight}kg on ${record.date_recorded.toISOString().split('T')[0]}) as an equal or newer record already exists.`);
                }
            } else {
                // If no document exists for this month, insert a new one
                const insertDoc = {
                    "user_id": record.user_id,
                    "year": year,
                    "month": month,
                    "latest_weight": record.weight,
                    "latest_date_recorded": record.date_recorded,
                    "createdAt": new Date(), // Set creation timestamp
                    "updatedAt": new Date()  // Set update timestamp
                };
                await weightChangeCollection.insertOne(insertDoc);
                console.log(`Upserted: Inserted new monthly weight for ${year}-${month}: ${record.weight}kg (recorded on ${record.date_recorded.toISOString().split('T')[0]}).`);
            }
        }
        console.log("\nDatabase seeding complete.");

    } catch (error) {
        console.error("Fatal error during data pre-population:", error);
        throw error; // Re-throw to be caught by the .catch() block below
    } finally {
        if (connection) {
            await client.close();
            console.log("MongoDB connection closed for data seeding.");
        }
    }
}

insertWeightsIntoDB()
    .then(() => console.log("Weight data pre-population operation completed."))
    .catch((err) => {
        console.error("Fatal error during weight data pre-population:", err);
        process.exit(1);
    });
