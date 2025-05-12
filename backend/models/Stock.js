import mongoose from "mongoose";


const stockSchema = new mongoose.Schema({
    symbol: {type: String, required: true, unique: true},
    name: String,
    sector: String,
    industry: String,
    logoUrl: String,
    marketCap: Number,
    peRatio: Number,
    updatedAt: {type:Date, default:Date.now},
})

export default mongoose.model("Stock",stockSchema)