const http = require('http');
const Todo = require('./models/todo');
const { successHandler, errorHandler } = require('./models/responses');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log('Connect'))
  .catch((err) => console.log(err));

const requestListener = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  if (req.url === '/todos' && req.method === 'GET') {
    const todos = await Todo.find();
    successHandler(res, todos);
  } else if (req.url === '/todos' && req.method === 'POST') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const newTodo = await Todo.create({
          title: data.title,
          completed: false,
        });
        successHandler(res, newTodo);
      } catch (err) {
        errorHandler(res, '資料錯誤');
      }
    });
  } else if (req.url === '/todos' && req.method === 'DELETE') {
    const todos = await Todo.deleteMany({});
    successHandler(res, todos);
  } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    const todos = await Todo.findByIdAndDelete(id);
    successHandler(res, todos);
  } else if (req.url.startsWith('/todos/') && req.method === 'PATCH') {
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const id = req.url.split('/').pop();
        if (data !== undefined) {
          const todos = await Todo.findByIdAndUpdate(id, {
            $set: {
              title: data.title,
              completed: data.completed,
            },
          });
          successHandler(res, todos);
        } else {
          errorHandler(res, '資料錯誤');
        }
      } catch {
        errorHandler(res, '查無此id');
      }
    });
  } else if (eq.url === '/todos' && req.method === 'OPTIONS') {
    successHandler(res, todos);
  } else {
    errorHandler(res, '查無此網頁');
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT);
