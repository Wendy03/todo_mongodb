const mongoose = require('mongoose');
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, '代辦事項必填'],
    },
    complete: Boolean,
    createAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { versionKey: false }
);

const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;
