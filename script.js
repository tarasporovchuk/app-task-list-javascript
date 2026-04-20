// Отримуємо посилання на елементи DOM
const taskInput = document.getElementById('task-input');
const taskAddBtn = document.getElementById('add-btn'); // Виправлено id
const taskList = document.getElementById('task-list');

document.addEventListener('DOMContentLoaded', loadTaskList);

// Функція для додавання нового завдання
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    createTaskListElement(taskText, false);
    saveTaskList(); // Зберігаємо після додавання

    taskInput.value = "";
    taskInput.focus();
}

// Функція як для додавання нових завдань, так і для
// відтворення збереженого списку завдань з LocalStorage
function createTaskListElement(taskText, isCompleted) {
    const label = document.createElement('label');
    label.className = 'task-list-item';

    // ІНТЕГРАЦІЯ: Додано кнопку редагування (✏️) та виконання (✔)
    label.innerHTML = `
        <input type="checkbox" ${isCompleted ? 'checked' : ''}>
        <span class="task-checkmark"></span>
        <span class="task-text" contenteditable="true" spellcheck="false">${taskText}</span>
        <button class="task-edit-btn" title="Редагувати завдання">✏️</button>
        <button class="task-done-btn" title="Змінити відмітку виконання завдання">✔</button>                
        <button class="delete-btn" title="Видалити завдання">✖</button>
    `;

    const textSpan = label.querySelector('.task-text');
    const taskEditBtn = label.querySelector('.task-edit-btn'); // Отримуємо кнопку редагування

    // Зберігаємо зміни, коли користувач клікає поза текстом (втрата фокусу)
    textSpan.addEventListener('blur', () => {
        // Перевіряємо, чи текст не порожній
        if (textSpan.innerText.trim() === "") {
            textSpan.innerText = "Введіть нове завдання"; // Запобігаємо зникненню елемента
        }
        // Відновлюємо стан кнопки редагування
        const isEditing = label.classList.contains('editing');
        if (isEditing) {
            label.classList.remove('editing');
            taskEditBtn.innerText = '✏️';
            taskEditBtn.title = "Редагувати завдання";
        }
        saveTaskList();
    });

    // Змінюємо відображення кнопки для редагування під час фокусу (редагування)
    textSpan.addEventListener('focus', (e) => {
        e.preventDefault();
        const isEditing = label.classList.contains('editing');
        if (!isEditing) {
            label.classList.add('editing');
            taskEditBtn.innerText = '💾';
            taskEditBtn.title = 'Завершіть редагування завдання натисненням клавіши "Enter"';
        }
    });

    // Зберігаємо зміни при натисканні Enter
    textSpan.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Запобігаємо перенесенню рядка
            textSpan.blur();    // Викликаємо подію blur для збереження
        }
    });

    // Запобігаємо спрацюванню label при кліку на завданні
    textSpan.addEventListener('click', (e) => {
        e.preventDefault();
    });

    // Подія для чекбокса: зберігаємо стан (виконано/не виконано)
    const checkbox = label.querySelector('input');
    checkbox.addEventListener('change', () => {
        saveTaskList(); 
    });

    // Подія для кнопки зміни стану виконання завдання
    const taskDoneBtn = label.querySelector('.task-done-btn');
    taskDoneBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        checkbox.checked = !checkbox.checked;
        saveTaskList(); 
    });

    // Подія для кнопки видалення завдання
    const taskDeleteBtn = label.querySelector('.delete-btn');
    taskDeleteBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        label.remove();
        saveTaskList(); 
    });

    // Подія для кнопки редагування та збереження завдання
    taskEditBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        const isEditing = label.classList.contains('editing');
        if (isEditing) {
            textSpan.blur(); // Якщо вже редагуємо, то втрачаємо фокус (зберігаємо)
        } else {
            textSpan.focus(); // Якщо не редагуємо, активуємо поле для вводу
        }
    });

    taskList.appendChild(label);
}

// Функція для збереження всіх завдань у LocalStorage
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

// Функція для завантаження списку завдань з LocalStorage
function loadTaskList() {
    // Видаляємо всі статичні завдання
    let staticTaskList = document.querySelectorAll('.task-list-item');
    staticTaskList.forEach(item => {
        item.remove();
    });

    const savedTaskList = localStorage.getItem('myTaskList');
    if (savedTaskList) {
        const myTaskList = JSON.parse(savedTaskList);
        myTaskList.forEach(task => { // Виправлено конфлікт імен
            createTaskListElement(task.text, task.completed);
        });
    }
}

// Функція для обробки подій на статичних елементах списку
function attachTaskListEvents(label) {
    const textSpan = label.querySelector('.task-text');
    const taskEditBtn = label.querySelector('.task-edit-btn'); // Додано змінну сюди

    if(!textSpan) return; // Захист від помилок

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

// Навішуємо події на початкові завдання
document.querySelectorAll('#task-list label').forEach(attachTaskListEvents);

// Слухач кліку по кнопці "Додати"
taskAddBtn.addEventListener('click', addTask);

// Дозволяємо додавати завдання натисканням клавіші Enter
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});