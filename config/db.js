import mongoose from "mongoose";
//Connect to MongoDB database
const connectDB=async () =>{
    try{
        // Connect using the MongoDB URI from the .env file
        await mongoose.connect(process.env.MONGO_URI);

        // Display success message
        console.log("MongoDB connected successfully");
    } catch(error){
        //Display error message
         console.error("MongoDB connection failed:",error.message);
         process.exit(1);
    }
};
//Export the database connection function
export default connectDB;
