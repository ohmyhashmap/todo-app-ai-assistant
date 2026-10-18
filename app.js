// Elemen DOM
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const todoCounter = document.getElementById('todo-counter');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// Inisialisasi Data & Penanganan localStorage Kosong
let todos;
try {
  todos = JSON.parse(localStorage.getItem('todos')) || [];
} catch (e) {
  todos = [];
  localStorage.removeItem('todos');
}

let currentFilter = 'all';

// Fungsi Menyimpan Data ke localStorage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Fungsi Render Daftar Tugas
function renderTodos() {
  todoList.innerHTML = '';

  const filteredTodos = todos.filter(todo => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true; // 'all'
  });

  if (filteredTodos.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = currentFilter === 'all'
      ? 'Belum ada tugas. Tambahkan tugas pertamamu!'
      : 'Tidak ada tugas pada filter ini.';
    todoList.appendChild(empty);
  } else {
    filteredTodos.forEach(todo => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

      const contentDiv = document.createElement('div');
      contentDiv.className = 'todo-content';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.completed;
      checkbox.addEventListener('change', () => toggleTodo(todo.id));

      const span = document.createElement('span');
      span.className = 'todo-text';
      span.textContent = todo.text;

      contentDiv.appendChild(checkbox);
      contentDiv.appendChild(span);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Hapus';
      deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

      li.appendChild(contentDiv);
      li.appendChild(deleteBtn);

      todoList.appendChild(li);
    });
  }

  // Update counter tugas
  const remaining = todos.filter(t => !t.completed).length;
  todoCounter.textContent =
    `${remaining} tugas belum selesai dari ${todos.length} total`;

  // Update status tombol hapus-selesai
  const hasCompleted = todos.some(todo => todo.completed);
  clearCompletedBtn.disabled = !hasCompleted;
}

// Menambah Tugas Baru
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();

  if (text !== '') {
    const newTodo = {
      id: Date.now(),
      text: text,
      completed: false
    };

    todos.push(newTodo);
    saveTodos();
    renderTodos();
    todoInput.value = '';
  }
});

// Menandai Selesai/Belum Selesai
function toggleTodo(id) {
  todos = todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  saveTodos();
  renderTodos();
}

// Menghapus Satu Tugas
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTodos();
}

// Event Listener Tombol Filter
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

// Event Listener Tombol Hapus Semua Selesai
clearCompletedBtn.addEventListener('click', () => {
  const count = todos.filter(t => t.completed).length;
  if (count === 0) return;
  if (!confirm(`Hapus ${count} tugas yang sudah selesai?`)) return;

  todos = todos.filter(t => !t.completed);
  saveTodos();
  renderTodos();
});

// Render Awal Saat Halaman Dimuat
renderTodos();