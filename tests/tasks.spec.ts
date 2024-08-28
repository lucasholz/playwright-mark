import { test } from '@playwright/test';
import { TaskModel } from './fixtures/task.model';
import { deleteTaskByHelper, postTask } from './support/helpers';
import { TasksPage } from './support/pages/tasks';

test('must be able to register a new task', async ({ page, request }) => {

  const task: TaskModel = {
    name: 'Read a TypeScript book',
    is_done: false
  }

  await deleteTaskByHelper(request, task.name)

  const tasksPage: TasksPage = new TasksPage(page)

  await tasksPage.go()
  await tasksPage.create(task)
  await tasksPage.shouldHaveText(task.name)


  await page.waitForTimeout(1)
});

test('should not allow duplicate task', async ({ page, request }) => {

  const task: TaskModel = {
    name: 'Buy Ketchup',
    is_done: false
  }

  await deleteTaskByHelper(request, task.name)
  await postTask(request, task)

  const tasksPage: TasksPage = new TasksPage(page)

  await tasksPage.go()
  await tasksPage.create(task)
  await tasksPage.alertHaveText('Task already exists!')

  await page.waitForTimeout(1)
});