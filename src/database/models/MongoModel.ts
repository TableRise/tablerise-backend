import { Model, UpdateQuery } from "mongoose";
import IModel from "../../interfaces/IModel";

abstract class MongoModel<T> implements IModel<T> {
  constructor(protected _model: Model<T>) {}

  public async create(payload: T): Promise<T> {
      return this._model.create({ ...payload });
  }

  public async findAll(): Promise<T[]> {
    return this._model.find({});
  }
  
  public async findOne(_id: string): Promise<T | null> {
    return this._model.findOne({ _id });
  }

  public async update(_id: string, payload: T): Promise<T | null> {
    return this._model.findByIdAndUpdate(
      { _id },
      { ...payload } as UpdateQuery<T>,
      { new: true }
    );
  }

  public async delete(_id: string): Promise<T | null> {
    return this._model.findByIdAndDelete({ _id });
  }
}

export default MongoModel;
