class AbstractElement {
  $(selector) {
    return document.querySelector(selector);
  }

  #forEachEl(arrToBe, cb) {
    if(!Array.isArray(arrToBe)) arrToBe = [arrToBe];
    for(let node of arrToBe) cb(node);
  }

  newEl(tagName, {innerText = '', cls = [], children = []}) {
    const el = document.createElement(tagName);
    if(innerText) el.innerText = innerText;
    this.#forEachEl(cls, c => el.classList.add(c));
    this.#forEachEl(children, child => el.appendChild(child));
    
    return el;
  }

  li({innerText = '', cls = [], children = []}) {
    return this.newEl('li', {innerText, cls, children});
  }

  span({innerText = '', cls = [], children = []}) {
    return this.newEl('span', {innerText, cls, children});
  }

  h3({innerText = '', cls = [], children = []}) {
    return this.newEl('h3', {innerText, cls, children});
  }

  div({innerText = '', cls = [], children = []}) {
    return this.newEl('div', {innerText, cls, children});
  }
}

class TaskFormController extends AbstractElement {
  
  constructor() {
    super();
    this.form = this.$('.task-form');
    this.taskName = this.$('[name="task-name"]');
    this.taskType = this.$('[name="task-type"]');
    this.submitBtn = this.$('#save-task')
  }

  reset() {
    this.taskName.value = '';
    this.taskType.value = '';
  }
}

class TaskListController extends AbstractElement {
  constructor() {
    super();
    this.list = this.$('.task-list');
  }

  newTask(taskText, taskType) {
    const divChildren = [
      this.h3({ innerText: taskText, cls: 'task-name' }),
      this.span({ innerText: taskType, cls: 'task-type' })
    ];
    const div = this.div({ cls: 'task-info', children: divChildren })
    return this.li({ cls:'task-item', children: div });
  }

  appendToList(...li) {
    this.list.append(...li);
  }
}

const taskForm = new TaskFormController;
const taskList = new TaskListController;

function newTaskHandler(event) {
  event.preventDefault();

  const task = taskList.newTask(taskForm.taskName.value, taskForm.taskType.value);
  taskList.appendToList(task);
  taskForm.reset();
}

taskForm.form.addEventListener('submit', newTaskHandler);
