class AbstractElement {
  /**
   * A shortcut to querySelector
   * @param {str} selector 
   * @returns {Array}
   */
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

  select({innerText = '', cls = [], children =[]}) {
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

  get name() {
    return this.taskName.value;
  }

  set name(value) {
    this.taskName.value = value;
  }

  get type() {
    return this.taskType.value;
  }

  set type(value) {
    this.taskType.value = value;
  }

  reset() {
    this.name = '';
    this.type = '';
  }
}

class TaskListController extends AbstractElement {
  constructor() {
    super();
    this.list = this.$('#tasks-to-do');
    this.grandParent = this.$('.page-content');
  }

  getId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  taskName(taskText) {
    return `<h3 class="task-name">${taskText}</h3>`;
  }

  taskType(taskType) {
    return `<span class="task-type">${taskType}</span>`;
  }

  taskInfo(taskText, taskType) {
    return `<div class="task-info">${this.taskName(taskText)}${this.taskType(taskType)}</div>`;
  }

  taskButton(text, cls) {
    return `<button class="btn ${cls}">${text}</button>`;
  }

  taskSelect(name, options) {
    let html = `<select name="${name}">`;
    for(let option of options) {
      html += `<option vlaue="${option}">${option}</option>`;
    }
    html += `</select>`;

    return html;
  }

  taskActions() {
    return `<div class="task-actions">
      ${this.taskButton('Edit', 'edit-btn')}
      ${this.taskButton('Delete', 'delete-btn')}
      ${this.taskSelect('status-change', ['To Do', 'In Progress', 'Completed'])}
    </div>`;
  }

  newTask(taskText, taskType) {
    const li = this.li({ cls:'task-item' });
    li.dataset.taskId = this.getId();
    li.insertAdjacentHTML('beforeend', this.taskInfo(taskText, taskType));
    li.insertAdjacentHTML('beforeend', this.taskActions());
    return li;
  }

  appendToList(...li) {
    this.list.append(...li);
  }
}

class TaskController {
  static getTask(el) {
    switch(el.constructor.name) {
      case 'HTMLButtonElement':
      case 'HTMLSelectElement':
        return new TaskController(el.parentElement.parentElement.dataset.taskId);
      case 'HTMLLIElement':
        return new TaskController(el.dataset.taskId);
      default:
        return new TaskController();
        break;
    }
  }

  constructor(id) {
    this.list = {
      toDo: document.querySelector('#tasks-to-do'),
      inProgress: document.querySelector('#tasks-in-progress'),
      completed: document.querySelector('#tasks-completed')
    }

    this.task = null;
    if(id === undefined) {
      this.newTask();
    } else {
      this.task = document.querySelector(`.task-item[data-task-id="${id}"]`);
    }
  }

  newId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  newTask() {
    this.task = document.createElement('li');
    this.task.classList.add('task-item');
    this.task.insertAdjacentHTML('beforeend', `<div class="task-info">
      <h3 class="task-name"></h3>
      <span class="task-type"></span>
    </div>
    <div class="task-actions">
      <button class="btn edit-btn">Edit</button>
      <button class="btn delete-btn">Delete</button>
      <select name="status-change">
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
    </div>`);
    this.id = this.newId();
  }

  moveTaskToDo() {
    this.list.toDo.appendChild(this.task);
  }

  moveTaskInProgress() {
    this.list.inProgress.appendChild(this.task);
  }

  moveTaskCompleted() {
    this.list.completed.appendChild(this.task);
  }

  delete() {
    this.task.remove();
  }

  getStatusChange() {
    return this.task.querySelector('[name="status-change"]').value;
  }

  changeState() {
    switch(this.getStatusChange()) {
      case 'To Do':
        this.moveTaskToDo();
        break;
      case 'In Progress':
        this.moveTaskInProgress();
        break;
      case 'Completed':
        this.moveTaskCompleted();
        break;
      default:
        console.log(this.getStatusChange());
        this.moveTaskToDo();
        break;
    }
  }

  $(selector) {
    return this.task.querySelector(selector);
  }

  get id() {
    return this.task.dataset.taskId;
  }

  set id(str) {
    this.task.dataset.taskId = str;
  }

  get name() {
    return this.$('.task-name').innerText;
  }

  set name(str) {
    this.$('.task-name').innerText = str
  }

  get type() {
    return this.$('.task-type').innerText;
  }

  set type(str) {
    this.$('.task-type').innerText = str;
  }

  get state() {
    switch(this.task.parentElement.id) {
      case 'tasks-to-do':
        return 'To Do';
      case 'tasks-in-progress':
        return 'In Progress';
      case 'tasks-completed':
        return 'Completed';
    }
  }

  set state(str) {
    this.$('[name="status-change"]').value = str;
    this.changeState();
  }

  toObject() {
    return {
      name: this.name,
      type: this.type,
      state: this.state
    }
  }

  toString() {
    return JSON.stringify(this.toObject());
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

  if(taskForm.submitBtn.innerText === 'Save Task') {
    let task = new TaskController(taskForm.submitBtn.dataset.taskId);
    task.name = taskForm.name;
    task.type = taskForm.type;
    taskForm.submitBtn.dataset.taskId = '';
    taskForm.submitBtn.innerText = 'Add Task';
  } else {
    let task = new TaskController();
    task.name = taskForm.name;
    task.type =taskForm.type;
    task.state = 'To Do';
  }
  taskForm.reset();
  updateStorage();
}

function updateStorage() {
  let storage = [];
  let taskList = document.querySelectorAll('.task-item');
  
  for(let task of taskList) {
    let taskObj = TaskController.getTask(task);
    storage.push(taskObj.toObject());
  }

  localStorage.setItem('todo', JSON.stringify(storage));
}

function loadStorage() {
  let storage = JSON.parse(localStorage.getItem('todo'));
  for(let task of storage) {
    let taskObj = new TaskController();
    taskObj.name = task.name;
    taskObj.type = task.type;
    taskObj.state = task.state;
  }
}

function taskActionHandler(event) {
  const el = event.target;
  switch(el.classList.value) {
    case 'btn edit-btn':
      let task = TaskController.getTask(el);
      taskForm.submitBtn.dataset.taskId = task.id;
      taskForm.submitBtn.innerText = 'Save Task';
      taskForm.name = task.name;
      taskForm.type = task.type;
      return;
    case 'btn delete-btn':
      TaskController.getTask(el).delete();
      updateStorage();
      return;
    default:
      return;
  }
}

function taskChangeHandler(event) {
  TaskController.getTask(event.target).changeState();
  updateStorage();
}

const tasks = [];

taskForm.form.addEventListener('submit', newTaskHandler);
taskList.grandParent.addEventListener('click', taskActionHandler);
taskList.grandParent.addEventListener('change', taskChangeHandler);

document.onreadystatechange = function() {
  if(document.readyState === 'complete') {
    loadStorage();
  }
}