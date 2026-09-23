const crypto = require('crypto');

const VALID_STATUSES = ['pending', 'in-progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

const tasks = new Map();

function validateTaskInput(data, { partial = false } = {}) {
  const { title, status, priority } = data;

  if (!partial || title !== undefined) {
    if (!title || typeof title !== 'string' || !title.trim()) {
      throw new ValidationError('title is required and must be a non-empty string');
    }
  }
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    throw new ValidationError(`status must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    throw new ValidationError(`priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
  }
}

function createTask(data) {
  validateTaskInput(data);
  const now = new Date().toISOString();
  const task = {
    id: crypto.randomUUID(),
    title: data.title.trim(),
    description: data.description || '',
    status: data.status || 'pending',
    priority: data.priority || 'medium',
    createdAt: now,
    updatedAt: now,
  };
  tasks.set(task.id, task);
  return task;
}

function getAllTasks() {
  return Array.from(tasks.values());
}

function getTaskById(id) {
  const task = tasks.get(id);
  if (!task) {
    throw new NotFoundError(`Task with id ${id} not found`);
  }
  return task;
}

function updateTask(id, data) {
  const task = getTaskById(id);
  validateTaskInput(data, { partial: true });

  if (data.title !== undefined) task.title = data.title.trim();
  if (data.description !== undefined) task.description = data.description;
  if (data.status !== undefined) task.status = data.status;
  if (data.priority !== undefined) task.priority = data.priority;
  task.updatedAt = new Date().toISOString();

  tasks.set(id, task);
  return task;
}

function deleteTask(id) {
  getTaskById(id);
  tasks.delete(id);
}

function _reset() {
  tasks.clear();
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  ValidationError,
  NotFoundError,
  _reset,
};
