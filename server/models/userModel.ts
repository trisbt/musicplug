import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    firstname: { type: String, required: true, },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favorites: [{
        id: { type: String, unique: true },
        song: { type: String },
        artist: { type: String },
        album: { type: String },
        image: { type: String },
        key: { type: String },
        tempo: { type: Number },
        loudness: { type: Number },
    }],
    keepMeLoggedIn:{type: String, unique:true}
});

export default mongoose.model('User', userSchema);
