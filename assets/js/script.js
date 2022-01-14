var btn = document.body.querySelector('#save-task');

function createTaskElement(taskText) {
  var li = document.createElement('li');
  li.innerText = taskText;
  li.classList.add('task-item');
  return li;
}

function addNewTask(event) {
  var list = document.querySelector('#tasks-to-do');
  var task = createTaskElement('Things to do.');

  list.appendChild(task);
}

btn.addEventListener('click', addNewTask);
