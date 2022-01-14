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
    this.submitBtn = this.$('#save-task');
  }

  get isFormReady() {
    return (!this.isNameEmpty && !this.isTypeEmpty);
  }

  get isNameEmpty() {
    return this.nameValue === '';
  }

  get isTypeEmpty() {
    return this.typeValue === '';
  }

  get nameValue() {
    return this.taskName.value;
  }

  set nameValue(value) {
    this.taskName.value = value;
  }

  get typeValue() {
    return this.taskType.value;
  }

  set typeValue(value) {
    this.taskType.value = value;
  }

  reset() {
    this.nameValue = '';
    this.typeValue = '';
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
  
  if(!taskForm.isFormReady) {
    alert('Please provide a task name and type.');
    return false;
  }
  const task = taskList.newTask(taskForm.nameValue, taskForm.typeValue);  

  taskForm.reset();
  taskList.appendToList(task);
}

taskForm.form.addEventListener('submit', newTaskHandler);
