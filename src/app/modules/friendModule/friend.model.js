import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({

}, {
    timestamps: true,
})


const Friend = mongoose.model('friend', friendSchema);

export default Friend