import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const accessSchema = new Schema({
  sessionId: {
    type: String,
    require: true,
  },
  time: {
    type: String,
    require: true,
  },
});

const Access = mongoose.model("access", accessSchema);
export default Access