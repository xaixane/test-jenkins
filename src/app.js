const express = require('express');
const taskController = require('./controllers/taskController');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/api/tasks', taskController.createTask);
app.get('/api/tasks', taskController.listTasks);
app.get('/api/tasks/:id', taskController.getTask);
app.put('/api/tasks/:id', taskController.updateTask);
app.delete('/api/tasks/:id', taskController.deleteTask);

app.use(errorHandler);

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`TaskMaster API listening on port ${port}`);
  });
}

module.exports = app;
