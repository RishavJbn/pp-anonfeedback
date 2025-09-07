import { connect } from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};
const connection: ConnectionObject = {};

const connectDb = async (): Promise<void> => {
    if (connection.isConnected) {
        console.log("Database is already connected....");
        return;
    }
    // Add your database connection logic here
    try {
        const db = await connect(process.env.MONGODB_URI!)

        connection.isConnected=db.connections[0].readyState;
        console.log("Database is CONNECTED successfully <==> ✅ Success ");


    } catch (error) {
        console.log("Database connection failed bro...",error)
        process.exit(1);
    }
};

export default connectDb;