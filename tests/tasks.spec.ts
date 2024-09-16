import { expect, test } from '@playwright/test';
import { TaskModel } from './fixtures/task.model';
import { deleteTaskByHelper, postTask } from './support/helpers';
import { TasksPage } from './support/pages/tasks';
import data from './fixtures/tasks.json'

test.describe('required fields', () => {

  test('must be able to register a new task', async ({ page, request }) => {

    const task = data.success as TaskModel

    await deleteTaskByHelper(request, task.name)

    const tasksPage: TasksPage = new TasksPage(page)

    await tasksPage.go()
    await tasksPage.create(task)
    await tasksPage.shouldHaveText(task.name)


    await page.waitForTimeout(1)
  });

  test('should not allow duplicate task', async ({ page, request }) => {
    const task = data.duplicate as TaskModel

    await deleteTaskByHelper(request, task.name)
    await postTask(request, task)

    const tasksPage: TasksPage = new TasksPage(page)

    await tasksPage.go()
    await tasksPage.create(task)
    await tasksPage.alertHaveText('Task already exists!')

    await page.waitForTimeout(1)
  });

  test('required field', async ({ page }) => {
    const task = data.required as TaskModel

    const tasksPage: TasksPage = new TasksPage(page)

    await tasksPage.go()
    await tasksPage.create(task)

    const validationMessage = await tasksPage.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
    expect(validationMessage).toEqual('This is a required field')

    await page.waitForTimeout(1)
  })
})

test.describe('update', () => {

  test('must complete a new task', async ({ page, request }) => {
    const task = data.update as TaskModel

    await deleteTaskByHelper(request, task.name)
    await postTask(request, task)

    const tasksPage: TasksPage = new TasksPage(page)

    await tasksPage.go()
    await tasksPage.toggle(task.name)
    await tasksPage.shouldBeDone(task.name)

    await page.waitForTimeout(1)
  })
});

test.describe('delete', () => {

  test('must delete a task', async ({ page, request }) => {
    const task = data.delete as TaskModel

    await deleteTaskByHelper(request, task.name)
    await postTask(request, task)

    const tasksPage: TasksPage = new TasksPage(page)

    await tasksPage.go()
    await tasksPage.remove(task.name)
    await tasksPage.shouldNotExist(task.name)

    await page.waitForTimeout(1)
  })
})