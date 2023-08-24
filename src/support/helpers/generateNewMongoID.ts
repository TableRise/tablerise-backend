import { mongoose } from '@tablerise/database-management';

export default (): string => {
    const newID = new mongoose.mongo.ObjectId();
    return newID.toString();
};
