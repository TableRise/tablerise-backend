import mongoose from 'mongoose';

export default (): string => {
    const newID = new mongoose.mongo.ObjectId();
    return newID.toString();
};
