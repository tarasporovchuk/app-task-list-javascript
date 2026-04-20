// Отримуємо посилання на елементи DOM
const taskInput = document.getElementById('task-input');
const taskAddBtn = document.getElementById('add-btn'); // Виправлено id (в методичці була опечатка task-add-btn)
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
    // Створюємо елемент завдання (контейнер label)
    const label = document.createElement('label');
    label.className = 'task-list-item';

    // Наповнюємо його структурними елементами
    label.innerHTML = `
        <input type="checkbox" ${isCompleted ? 'checked' : ''}>
        <span class="task-checkmark"></span>
        <span class="task-text" contenteditable="true" spellcheck="false">${taskText}</span>
        <button class="delete-btn" title="Видалити завдання">✖</button>
    `;

    // Зберігаємо зміни після редагування (втрата фокусу)
    const textSpan = label.querySelector('.task-text');
    textSpan.addEventListener('blur', () => {
        if (textSpan.innerText.trim() === "") {
            textSpan.innerText = "Введіть нове завдання";
        }
        saveTaskList(); 
    });

    // Зберігаємо зміни при натисканні Enter
    textSpan.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            textSpan.blur();    
        }
    });

    // Крок 79: Запобігаємо спрацюванню події для label при кліку на тексті завданні
    textSpan.addEventListener('click', (e) => {
        e.preventDefault();
    });

    // Подія для чекбокса
    const checkbox = label.querySelector('input');
    checkbox.addEventListener('change', () => {
        saveTaskList(); 
    });

    // Подія для кнопки видалення (Виправлено клас на .delete-btn)
    const taskDeleteBtn = label.querySelector('.delete-btn');
    taskDeleteBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        label.remove(); 
        saveTaskList(); 
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
    // Видаляємо всі статичні завдання з HTML
    let staticTaskList = document.querySelectorAll('.task-list-item');
    staticTaskList.forEach(item => {
        item.remove();
    });

    const savedTaskList = localStorage.getItem('myTaskList');
    if (savedTaskList) {
        const myTaskList = JSON.parse(savedTaskList);
        // Виправлено баг з назвами змінних з методички
        myTaskList.forEach(task => { 
            createTaskListElement(task.text, task.completed);
        });
    }
}

// Функція для обробки подій на існуючих елементах списку
function attachTaskListEvents(label) {
    const textSpan = label.querySelector('.task-text');
    textSpan.addEventListener('blur', () => {
        if (textSpan.innerText.trim() === "") {
            textSpan.innerText = "Введіть нове завдання"; 
        }
        saveTaskList(); 
    });

    textSpan.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            textSpan.blur();    
        }
    });

    // Крок 79: Запобігаємо спрацюванню події для label при кліку на тексті завданні
    textSpan.addEventListener('click', (e) => {
        e.preventDefault();
    });

    const checkbox = label.querySelector('input');
    checkbox.addEventListener('change', () => {
        saveTaskList(); 
    });

    // Виправлено клас на .delete-btn
    const taskDeleteBtn = label.querySelector('.delete-btn');
    taskDeleteBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        label.remove(); 
        saveTaskList(); 
    });
}

// Навішуємо обробку подій на статичні елементи
document.querySelectorAll('#task-list label').forEach(attachTaskListEvents);

// Додаємо слухач кліку по кнопці "Додати"
taskAddBtn.addEventListener('click', addTask);

// Дозволяємо додавати завдання натисканням клавіші Enter
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});