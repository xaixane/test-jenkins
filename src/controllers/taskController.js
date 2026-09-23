const taskService = require('../services/taskService');

function createTask(req, res, next) {
  try {
    const task = taskService.createTask(req.body || {});
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

function listTasks(req, res) {
  res.status(200).json(taskService.getAllTasks());
}

function getTask(req, res, next) {
  try {
    const task = taskService.getTaskById(req.params.id);
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
}

function updateTask(req, res, next) {
  try {
    const task = taskService.updateTask(req.params.id, req.body || {});
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
}

function deleteTask(req, res, next) {
  try {
    taskService.deleteTask(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { createTask, listTasks, getTask, updateTask, deleteTask };
