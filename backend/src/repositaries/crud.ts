import mongoose from "mongoose";

const errHandler = (message: string) => {
  throw new Error(`crud repo error` + message);
};

class CrudRepo {
  model: mongoose.Model<any>;
  constructor(model: mongoose.Model<any>) {
    this.model = model;
  }

  async create(data:any) {     
    try {
        return await this.model.create(data)
    } catch (error) {
      errHandler('create error')
    }
  }
}
               