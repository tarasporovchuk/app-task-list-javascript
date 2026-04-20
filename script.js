// Отримуємо посилання на елементи DOM
const taskInput = document.getElementById('task-input');
const taskAddBtn = document.getElementById('add-btn'); // Залишаємо виправлений id
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

    // ІНТЕГРАЦІЯ: Додано кнопку task-done-btn з методички та залишено правильний клас delete-btn
    label.innerHTML = `
        <input type="checkbox" ${isCompleted ? 'checked' : ''}>
        <span class="task-checkmark"></span>
        <span class="task-text" contenteditable="true" spellcheck="false">${taskText}</span>
        <button class="task-done-btn" title="Змінити відмітку виконання завдання">✔</button>                
        <button class="delete-btn" title="Видалити завдання">✖</button>
    `;

    // Зберігаємо зміни, коли користувач клікає поза текстом (втрата фокусу)
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

    // Запобігаємо спрацюванню label при кліку на завданні
    textSpan.addEventListener('click', (e) => {
        e.preventDefault();
    });

    // Подія для чекбокса
    const checkbox = label.querySelector('input');
    checkbox.addEventListener('change', () => {
        saveTaskList(); 
    });

    // ІНТЕГРАЦІЯ: Подія для кнопки виконання завдання (✔)
    const taskDoneBtn = label.querySelector('.task-done-btn');
    taskDoneBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Запобігаємо спрацюванню label
        checkbox.checked = !checkbox.checked; // Інвертуємо стан
        saveTaskList();
    });

    // Подія для видалення
    const taskDeleteBtn = label.querySelector('.delete-btn');
    taskDeleteBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        label.remove(); 
        saveTaskList(); 
    });

    // ІНТЕГРАЦІЯ: Подія для редагування (додано захист if, оскільки кнопки немає в HTML-шаблоні)
    const taskEditBtn = label.querySelector('.task-edit-btn');
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

    taskList.appendChild(label);
}

// Функція збереження всіх завдань у LocalStorage
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

// Функція завантаження списку завдань з LocalStorage
function loadTaskList() {
    // Видаляємо всі статичні завдання
    let staticTaskList = document.querySelectorAll('.task-list-item');
    staticTaskList.forEach(item => {
        item.remove();
    });

    const savedTaskList = localStorage.getItem('myTaskList');
    if (savedTaskList) {
        const myTaskList = JSON.parse(savedTaskList);
        // Залишено виправлену назву змінної "task", щоб не було конфлікту
        myTaskList.forEach(task => { 
            createTaskListElement(task.text, task.completed);
        });
    }
}

// Функція для обробки подій на статичних елементах списку
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

    textSpan.addEventListener('click', (e) => {
        e.preventDefault();
    });

    const checkbox = label.querySelector('input');
    checkbox.addEventListener('change', () => {
        saveTaskList(); 
    });

    // ІНТЕГРАЦІЯ: Подія для кнопки виконання (✔) для статичних елементів
    const taskDoneBtn = label.querySelector('.task-done-btn');
    if (taskDoneBtn) {
        taskDoneBtn.addEventListener('click', (e) => {
            e.preventDefault();
            checkbox.checked = !checkbox.checked;
            saveTaskList();
        });
    }

    const taskDeleteBtn = label.querySelector('.delete-btn');
    taskDeleteBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        label.remove(); 
        saveTaskList(); 
    });
}

// Навішуємо події на початкові завдання з HTML
document.querySelectorAll('#task-list label').forEach(attachTaskListEvents);

// Слухач кліку по кнопці "Додати"
taskAddBtn.addEventListener('click', addTask);

// Дозволяємо додавати завдання натисканням клавіші Enter
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});