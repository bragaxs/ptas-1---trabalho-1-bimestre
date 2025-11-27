import mongoose from "mongoose";

export async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB Atlas conectado!");
  } catch (err) {
    console.error("Erro ao conectar Mongo:", err);
    process.exit(1);
  }
}
