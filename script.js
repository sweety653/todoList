console.log('JS Загружен');

const form = document.getElementById('addForm');
const input = document.getElementById('taskInput');
const list = document.getElementById('todoList');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]')

function renderTask(task) {
  const li = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-check';
  checkbox.checked = task.done;
  if (task.done) li.classList.add('completed');

  const span = document.createElement('span');
  span.textContent = task.text;

  const delBtn = document.createElement('button');
  delBtn.textContent = '✕';
  delBtn.className = 'delete-btn';

  checkbox.addEventListener('change', function() {
    task.done = checkbox.checked;
    li.classList.toggle('completed');
    saveTasks();
  });

  delBtn.addEventListener('click', function() {
    tasks = tasks.filter(t => t !== task);
    li.remove();
    saveTasks();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(delBtn);
  list.appendChild(li);
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const text = input.value.trim();
  if (text === '') return;

  const task = { text: text, done: false };
  tasks.push(task);
  renderTask(task);
  saveTasks();

  input.value = '';
});

tasks.forEach(task => renderTask(task));