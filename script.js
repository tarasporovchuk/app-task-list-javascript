// Отримуємо посилання на елементи DOM
const taskInput = document.getElementById('task-input');
const taskAddBtn = document.getElementById('add-btn'); 
const taskList = document.getElementById('task-list');

document.addEventListener('DOMContentLoaded', loadTaskList);

// Функція для додавання нового завдання
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    createTaskListElement(taskText, false);
    saveTaskList(); 

    taskInput.value = "";
    taskInput.focus();
}

// Функція як для додавання нових завдань, так і для відтворення з LocalStorage
function createTaskListElement(taskText, isCompleted) {
    const label = document.createElement('label');
    label.className = 'task-list-item';

    label.innerHTML = `
        <input type="checkbox" ${isCompleted ? 'checked' : ''}>
        <span class="task-checkmark"></span>
        <span class="task-text" contenteditable="true" spellcheck="false">${taskText}</span>
        <button class="task-edit-btn" title="Редагувати завдання">✏️</button>
        <button class="task-done-btn" title="Змінити відмітку виконання завдання">✔</button>                
        <button class="delete-btn" title="Видалити завдання">✖</button>
    `;

    const textSpan = label.querySelector('.task-text');
    const taskEditBtn = label.querySelector('.task-edit-btn'); 

    textSpan.addEventListener('blur', () => {
        if (textSpan.innerText.trim() === "") {
            textSpan.innerText = "Введіть нове завдання"; 
        }
        const isEditing = label.classList.contains('editing');
        if (isEditing) {
            label.classList.remove('editing');
            taskEditBtn.innerText = '✏️';
            taskEditBtn.title = "Редагувати завдання";
        }
        saveTaskList();
    });

    textSpan.addEventListener('focus', (e) => {
        e.preventDefault();
        const isEditing = label.classList.contains('editing');
        if (!isEditing) {
            label.classList.add('editing');
            taskEditBtn.innerText = '💾';
            taskEditBtn.title = 'Завершіть редагування завдання натисненням клавіши "Enter"';
        }
    });

    textSpan.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            textSpan.blur();    
        }
    });

    textSpan.addEventListener('click', (e) => {
        e.preventDefault();
    });

    const checkbox = label.querySelector('input');
    checkbox.addEventListener('change', () => {
        saveTaskList(); 
    });

    const taskDoneBtn = label.querySelector('.task-done-btn');
    taskDoneBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        checkbox.checked = !checkbox.checked;
        saveTaskList(); 
    });

    const taskDeleteBtn = label.querySelector('.delete-btn');
    taskDeleteBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        label.remove();
        saveTaskList(); 
    });

    // ВИПРАВЛЕННЯ: Запобігаємо втраті фокусу текстом доки ми не клікнули кнопку
    taskEditBtn.addEventListener('mousedown', (e) => {
        e.preventDefault(); 
    });

    taskEditBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        const isEditing = label.classList.contains('editing');
        if (isEditing) {
            textSpan.blur(); 
        } else {
            textSpan.focus(); 
        }
    });

    taskList.appendChild(label);
}

function saveTaskList() {
    const myTaskList = [];
    document.querySelectorAll('.task-list-item').forEach(item => {
        myTaskList.push({
            text: item.querySelector('.task-text').innerText,
            completed: item.querySelector('input').checked
        });
    });
    localStorage.setItem('myTaskList', JSON.stringify(myTaskList));
}

function loadTaskList() {
    let staticTaskList = document.querySelectorAll('.task-list-item');
    staticTaskList.forEach(item => {
        item.remove();
    });

    const savedTaskList = localStorage.getItem('myTaskList');
    if (savedTaskList) {
        const myTaskList = JSON.parse(savedTaskList);
        myTaskList.forEach(task => { 
            createTaskListElement(task.text, task.completed);
        });
    }
}

function attachTaskListEvents(label) {
    const textSpan = label.querySelector('.task-text');
    const taskEditBtn = label.querySelector('.task-edit-btn'); 

    if(!textSpan) return; 

    textSpan.addEventListener('blur', () => {
        if (textSpan.innerText.trim() === "") {
            textSpan.innerText = "Введіть нове завдання"; 
        }
        const isEditing = label.classList.contains('editing');
        if (isEditing && taskEditBtn) {
            label.classList.remove('editing');
            taskEditBtn.innerText = '✏️';
            taskEditBtn.title = "Редагувати завдання";
        }
        saveTaskList();
    });

    textSpan.addEventListener('focus', (e) => {
        e.preventDefault();
        const isEditing = label.classList.contains('editing');
        if (!isEditing && taskEditBtn) {
            label.classList.add('editing');
            taskEditBtn.innerText = '💾';
            taskEditBtn.title = 'Завершіть редагування завдання натисненням клавіши "Enter"';
        }
    });

    textSpan.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            textSpan.blur();    
        }
    });

    textSpan.addEventListener('click', (e) => {
        e.preventDefault();
    });

    const checkbox = label.querySelector('input');
    if (checkbox) {
        checkbox.addEventListener('change', () => {
            saveTaskList(); 
        });
    }

    const taskDeleteBtn = label.querySelector('.delete-btn');
    if (taskDeleteBtn) {
        taskDeleteBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            label.remove();
            saveTaskList(); 
        });
    }

    const taskDoneBtn = label.querySelector('.task-done-btn');
    if (taskDoneBtn) {
        taskDoneBtn.addEventListener('click', (e) => {
            e.preventDefault();
            checkbox.checked = !checkbox.checked;
            saveTaskList();
        });
    }

    if (taskEditBtn) {
        // ВИПРАВЛЕННЯ: Запобігаємо втраті фокусу текстом доки ми не клікнули кнопку
        taskEditBtn.addEventListener('mousedown', (e) => {
            e.preventDefault(); 
        });

        taskEditBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            const isEditing = label.classList.contains('editing');
            if (isEditing) {
                textSpan.blur();
            } else {
                textSpan.focus();
            }
        });
    }
}

document.querySelectorAll('#task-list label').forEach(attachTaskListEvents);

taskAddBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});