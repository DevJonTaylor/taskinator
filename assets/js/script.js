class AbstractElement {
  $(selector) {
    return document.querySelector(selector);
  }

  newEl(tagName, {innerText = '', cls = []}) {
    const el = document.createElement(tagName);
    if(innerText) el.innerText = innerText;
    if(cls.length) {
      if(!Array.isArray(cls)) cls = [cls];
      el.classList.add(...cls);
    }

    return el;
  }

  li(options = {innerText: '', cls: []}) {
    return this.newEl('li', options);
  }
}

class TaskFormController extends AbstractElement {
  
  constructor() {
    super();
    this.form = this.$('.task-form');
    this.taskName = this.$('[name="task-name"]');
    this.taskType = this.$('.task-type');
    this.submitBtn = this.$('#save-task')
  }

  
}

class TaskListController extends AbstractElement {
  constructor() {
    super();
    this.list = this.$('.task-list');
  }

  newTask(taskText, taskType) {
    return this.li({innerText: taskText, cls:'task-item'})
  }

  appendToList(...li) {
    this.list.append(...li);
  }
}

const taskForm = new TaskFormController;
const taskList = new TaskListController;

function newTaskHandler(event) {
  event.preventDefault();

  const task = taskList.newTask(taskForm.taskName.value);
  taskList.appendToList(task);
}

taskForm.form.addEventListener('submit', newTaskHandler);
