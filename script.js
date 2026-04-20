// Отримуємо посилання на елементи DOM
const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
 
// Функція для створення нового завдання
function addTask() {
    const taskText = input.value.trim();
 
    if (taskText === "") {
        alert("Будь ласка, введіть текст нового завдання!");
        return;
    }
 
    // Створюємо елемент завдання (наш контейнер label)
    const label = document.createElement('label');
    label.className = 'task-list-item';
 
    // Наповнюємо його структурними елементами
    label.innerHTML = `
        <input type="checkbox">
        <span class="task-checkmark"></span>
        <span class="task-text">${taskText}</span>
    `;
 
    // Додаємо нове завдання в список
    taskList.appendChild(label);
 
    // Очищаємо поле введення нових завдань
    input.value = "";
    input.focus();
}
 
// Додаємо слухач кліку для кнопки додавання нових завдань
addBtn.addEventListener('click', addTask);
 
// Дозволяємо додавати завдання натисканням клавіші Enter
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});
// Функція для створення нового завдання
// з добавленням кнопки видалення
function addTask() {
    const taskText = input.value.trim();
 
    if (taskText === "") {
        alert("Будь ласка, введіть текст завдання!");
        return;
    }
 
    // Створюємо елемент завдання (контейнер label)
    const label = document.createElement('label');
    label.className = 'task-list-item';
 
    // Наповнюємо його структурними елементами
    label.innerHTML = `
        <input type="checkbox">
        <span class="task-checkmark"></span>
        <span class="task-text">${taskText}</span>
        <button class="delete-btn" title="Видалити завдання">✖</button>
    `;
 
    // Додаємо подію для кнопки видалення завдання
    const deleteBtn = label.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        label.remove(); // Видаляємо завдання
    });
 
    // Додаємо нове завдання в список
    taskList.appendChild(label);
 
    // Очищаємо поле вводу
    input.value = "";
    input.focus();
}
 
 // Функція для обробки подій на статичних елементах списку
function attachTaskEvents(label) {
    // Додаємо подію для кнопки видалення завдання
    const deleteBtn = label.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        label.remove();
    });
}
 
// Навішуємо функцію обробки подій на статичні елементи списку
document.querySelectorAll('#task-list label').forEach(attachTaskEvents);
