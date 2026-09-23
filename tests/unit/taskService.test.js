const taskService = require('../../src/services/taskService');

beforeEach(() => {
  taskService._reset();
});

describe('taskService', () => {
  test('createTask creates a task with defaults', () => {
    const task = taskService.createTask({ title: 'Write tests' });
    expect(task.id).toBeDefined();
    expect(task.title).toBe('Write tests');
    expect(task.status).toBe('pending');
    expect(task.priority).toBe('medium');
  });

  test('createTask rejects a missing title', () => {
    expect(() => taskService.createTask({})).toThrow(taskService.ValidationError);
  });

  test('createTask rejects an invalid status', () => {
    expect(() => taskService.createTask({ title: 'x', status: 'bogus' })).toThrow(
      taskService.ValidationError
    );
  });

  test('getAllTasks returns all created tasks', () => {
    taskService.createTask({ title: 'a' });
    taskService.createTask({ title: 'b' });
    expect(taskService.getAllTasks()).toHaveLength(2);
  });

  test('getTaskById returns the matching task', () => {
    const created = taskService.createTask({ title: 'a' });
    expect(taskService.getTaskById(created.id).id).toBe(created.id);
  });

  test('getTaskById throws NotFoundError for a missing id', () => {
    expect(() => taskService.getTaskById('missing')).toThrow(taskService.NotFoundError);
  });

  test('updateTask updates fields and bumps updatedAt', async () => {
    const created = taskService.createTask({ title: 'a' });
    await new Promise((resolve) => setTimeout(resolve, 5));
    const updated = taskService.updateTask(created.id, { status: 'completed' });
    expect(updated.status).toBe('completed');
    expect(updated.updatedAt).not.toBe(created.updatedAt);
  });

  test('deleteTask removes the task', () => {
    const created = taskService.createTask({ title: 'a' });
    taskService.deleteTask(created.id);
    expect(() => taskService.getTaskById(created.id)).toThrow(taskService.NotFoundError);
  });
});
