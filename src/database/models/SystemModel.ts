import { model as mongooseCreateModel, Schema } from 'mongoose';
import { ISystem } from '../../interfaces/ISystem';
import MongoModel from './MongoModel';

const systemMongooseSchema = new Schema<ISystem>({
  name: { type: String, required: true },
  reference: { type: String, required: true },
  rule_ids: {
    race: { type: Array, required: true },
    class: { type: Array, required: true },
    items: { type: Array, required: true },
    attacks: { type: Array, required: true },
    background: { type: Array, required: true }
  },
  details: { type: String, required: true }
});

class SystemModel extends MongoModel<ISystem> {
  constructor (public model = mongooseCreateModel('System', systemMongooseSchema)) {
    super(model)
  }
}

export default SystemModel;
