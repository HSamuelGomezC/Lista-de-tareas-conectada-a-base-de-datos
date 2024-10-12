// Capturar elementos del DOM
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const errorMessage = document.getElementById('error');
const loadTasksButton = document.getElementById('loadTasksButton');

// Función para agregar tarea al DOM
function addTaskToDOM(id, taskText) {
    const li = document.createElement('li');
    li.textContent = taskText;
    li.dataset.id = id;

    // Crear el botón de eliminar
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', deleteTask);

    // Añadir botón al li
    li.appendChild(deleteButton);

    // Añadir li a la lista
    taskList.appendChild(li);
}

// Obtener las tareas al hacer clic en "Cargar Tareas"
loadTasksButton.addEventListener('click', () => {
    fetch('http://localhost:3000/tasks')
        .then(response => response.json())
        .then(data => {
            taskList.innerHTML = ''; // Limpiar la lista antes de agregar las tareas
            data.forEach(task => {
                addTaskToDOM(task.id, task.task);
            });
        })
        .catch(err => console.error('Error al obtener las tareas:', err));
});

// Función para agregar una tarea
function addTask(event) {
    event.preventDefault();
    
    const taskText = taskInput.value.trim();
    
    if (taskText === "") {
        showError('Por favor ingresa una tarea');
        return;
    }

    // Enviar la tarea al servidor
    fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task: taskText })
    })
    .then(response => response.json())
    .then(data => {
        addTaskToDOM(data.id, data.task);
        taskInput.value = ''; // Limpiar el input
        hideError();
    })
    .catch(err => console.error('Error al agregar la tarea:', err));
}

// Función para eliminar una tarea
function deleteTask(event) {
    const taskItem = event.target.parentElement;
    const taskId = taskItem.dataset.id;

    // Enviar solicitud de eliminación al servidor
    fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'DELETE'
    })
    .then(() => {
        taskList.removeChild(taskItem); // Eliminar la tarea del DOM
    })
    .catch(err => console.error('Error al eliminar la tarea:', err));
}

// Función para mostrar mensaje de error
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

// Función para ocultar mensaje de error
function hideError() {
    errorMessage.style.display = 'none';
}

// Escuchar el envío del formulario para agregar tareas
taskForm.addEventListener('submit', addTask);
