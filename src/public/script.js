const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const todoList = document.getElementById('todo-list');

// Fetch existing todos on page load
window.onload = async () => {
    await fetchTodos();
};

// Function to fetch todos
async function fetchTodos() {
    const response = await fetch('/api/todos');
    const todos = await response.json();
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = todo.task;
        li.appendChild(createDeleteButton(todo.id));
        todoList.appendChild(li);
    });
}

// Function to create delete button
function createDeleteButton(id) {
    const button = document.createElement('button');
    button.textContent = 'Delete';
    button.onclick = async () => {
        await deleteTodo(id);
        await fetchTodos();
    };
    return button;
}

// Handle form submission
todoForm.onsubmit = async (e) => {
    e.preventDefault();
    const task = taskInput.value;

    await fetch('/api/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task }),
    });

    taskInput.value = '';
    await fetchTodos();
};

// Function to delete a todo
async function deleteTodo(id) {
    await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
    });
}
