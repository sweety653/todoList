const form = document.getElementById('addForm');
const input = document.getElementById('taskInput');
const list = document.getElementById('todoList');
const count = document.getElementById('counter');
const comp = document.getElementById('BtnComp');


let tasks = JSON.parse(localStorage.getItem('tasks') || '[]')

let draggedTask = null;

function renderTasks(task) {
  const li = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-check';
  checkbox.checked = task.done;
  if (task.done) li.classList.add('completed');

  const span = document.createElement('span');
  span.textContent = task.text;

  span.addEventListener('dblclick', function() {
  const editInput = document.createElement('input');
  editInput.value = task.text;
  li.replaceChild(editInput, span);
  editInput.focus();

  editInput.addEventListener('blur', function() {
    task.text = editInput.value;
    span.textContent = task.text;
    li.replaceChild(span, editInput);
    saveTasks();
  });
});
  
  li.draggable = true;

  li.addEventListener('dragstart', function(e) {
    draggedTask = task;
    li.classList.add('dragging');
  });

  li.addEventListener('dragover', function(e) {
    e.preventDefault();
});

  li.addEventListener('drop', function(){
    const fromIndex = tasks.indexOf(draggedTask);
    const toIndex = tasks.indexOf(task);
    tasks.splice(fromIndex, 1);
    tasks.splice(toIndex, 0, draggedTask);
    saveTasks();
    renderAll();
});





  const delBtn = document.createElement('button');
  delBtn.textContent = '✕';
  delBtn.className = 'delete-btn';

  
  checkbox.addEventListener('change', function() {
    task.done = checkbox.checked;
    li.classList.toggle('completed');
    saveTasks();
    updateCounter();
  });

  delBtn.addEventListener('click', function() {
    tasks = tasks.filter(t => t !== task);
    li.classList.add('removing');
    setTimeout(() => li.remove(), 300);
    saveTasks();
    updateCounter();
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
  renderAll();
  saveTasks();
  updateCounter();
  input.value = '';
});

function updateCounter() {
  const remainingTasks = tasks.filter(t => !t.done).length;
  count.textContent = `Осталось ${remainingTasks} ${declension(remainingTasks)}`;
}

comp.addEventListener('click', function() {
  const allLi = list.querySelectorAll('li');
  allLi.forEach(li => {
    if (li.classList.contains('completed')) {
      li.classList.add('removing');
      setTimeout(() => li.remove(), 300);
    }
  });
  tasks = tasks.filter(task => !task.done);
  saveTasks();
  updateCounter();
});

let currentFilter = 'all';

function renderAll() {
  list.innerHTML = '';
  tasks
    .filter(t => currentFilter === 'all' || (currentFilter === 'done' ? t.done : !t.done))
    .forEach(task => renderTasks(task));
}


document.getElementById('filters').addEventListener('click', function(e) {
  if (!e.target.classList.contains('filter-btn')) return;
  currentFilter= e.target.dataset.filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  renderAll();
});

document.getElementById('themeBtn').addEventListener('click', function(e) {
  document.body.classList.toggle('dark');
  this.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  localStorage.setItem('theme', document.body.classList.contains('dark'))
});
 

if (localStorage.getItem('theme') === 'true') {
  document.body.classList.add('dark');
}

function declension(n) {
  if (n % 100 >= 11 && n % 100 <= 19) return 'задач';
  if (n % 10 === 1) return 'задача';
  if (n % 10 >= 2 && n % 10 <= 4) return 'задачи';
  return 'задач';
}

renderAll();
updateCounter();
