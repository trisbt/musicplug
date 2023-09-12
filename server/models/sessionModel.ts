import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  cookieId: { type: String, required: true, unique: true },
  sessionToken: { type: String, required: true, unique: true }, 
  createdAt: { type: Date, expires: 3600, default: Date.now },

});

export default mongoose.model('Session', sessionSchema);
