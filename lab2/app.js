document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'todo_app_tasks';
  let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  let filterStatus = 'all';
  let sortOrder = 'none';
  let searchQuery = '';
  let draggedTaskId = null;

  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  };

  const body = document.body;

  const appContainer = document.createElement('main');
  appContainer.className = 'app-container';

  const header = document.createElement('header');
  header.className = 'app-header';
  const title = document.createElement('h1');
  title.className = 'app-title';
  title.textContent = 'To-Do List';
  header.append(title);

  const formSection = document.createElement('section');
  formSection.setAttribute('aria-label', 'Форма добавления задачи');

  const form = document.createElement('form');
  form.className = 'todo-form';

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.className = 'input-field';
  titleInput.placeholder = 'Что нужно сделать?';
  titleInput.required = true;

  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.className = 'input-field';
  dateInput.required = true;

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn btn-primary';
  submitBtn.textContent = 'Добавить';

  form.append(titleInput, dateInput, submitBtn);
  formSection.append(form);

  const controlsSection = document.createElement('section');
  controlsSection.className = 'controls-panel';
  controlsSection.setAttribute('aria-label', 'Панель управления');

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'input-field';
  searchInput.placeholder = 'Поиск по названию...';

  const controlsRow = document.createElement('div');
  controlsRow.className = 'controls-row';

  const filterGroup = document.createElement('div');
  filterGroup.className = 'filter-group';

  const filters = [
    { label: 'Все', value: 'all' },
    { label: 'Активные', value: 'active' },
    { label: 'Выполненные', value: 'completed' }
  ];

  const filterButtons = filters.map(f => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `btn btn-sm btn-filter ${f.value === 'all' ? 'active' : ''}`;
    btn.textContent = f.label;
    btn.dataset.status = f.value;
    filterGroup.append(btn);
    return btn;
  });

  const sortSelect = document.createElement('select');
  sortSelect.className = 'input-field btn-sm';
  const sortOptions = [
    { label: 'Без сортировки', value: 'none' },
    { label: 'Дата (по возрастанию)', value: 'asc' },
    { label: 'Дата (по убыванию)', value: 'desc' }
  ];
  sortOptions.forEach(opt => {
    const optionEl = document.createElement('option');
    optionEl.value = opt.value;
    optionEl.textContent = opt.label;
    sortSelect.append(optionEl);
  });

  controlsRow.append(filterGroup, sortSelect);
  controlsSection.append(searchInput, controlsRow);

  const listSection = document.createElement('section');
  listSection.setAttribute('aria-label', 'Список задач');

  const todoList = document.createElement('ul');
  todoList.className = 'todo-list';
  listSection.append(todoList);

  appContainer.append(header, formSection, controlsSection, listSection);
  body.append(appContainer);

      const addTask = (titleText, dateVal) => {
      const newTask = {
        id: Date.now().toString(),
        title: titleText,
        date: dateVal,
        completed: false,
        isEditing: false
      };
      tasks.unshift(newTask);
      saveToStorage();
      renderTasks();
    };

  const setupDragEvents = (li, id) => {
    li.addEventListener('dragstart', (e) => {
      draggedTaskId = id;
      li.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
      draggedTaskId = null;
      document.querySelectorAll('.todo-item').forEach(el => el.classList.remove('drag-over'));
    });

    li.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      li.classList.add('drag-over');
    });

    li.addEventListener('dragleave', () => {
      li.classList.remove('drag-over');
    });

    li.addEventListener('drop', (e) => {
      e.preventDefault();
      li.classList.remove('drag-over');

      if (draggedTaskId && draggedTaskId !== id) {
        const fromIndex = tasks.findIndex(t => t.id === draggedTaskId);
        const toIndex = tasks.findIndex(t => t.id === id);

        if (fromIndex !== -1 && toIndex !== -1) {
          const [movedItem] = tasks.splice(fromIndex, 1);
          tasks.splice(toIndex, 0, movedItem);
          saveToStorage();
          renderTasks();
        }
      }
    });
  };

  const renderTasks = () => {
    todoList.innerHTML = '';
    let filteredTasks = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (filterStatus === 'active') return !task.completed;
      if (filterStatus === 'completed') return task.completed;
      return true;
    });

    if (sortOrder === 'asc') {
      filteredTasks = [...filteredTasks].sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOrder === 'desc') {
      filteredTasks = [...filteredTasks].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
      if (filteredTasks.length === 0) {
        const emptyLi = document.createElement('li');
        emptyLi.className = 'empty-state';
        emptyLi.textContent = 'Задачи не найдены';
        todoList.append(emptyLi);
        return;
      }

      filteredTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `todo-item ${task.completed ? 'completed' : ''}`;
      li.dataset.id = task.id;
      li.draggable = true;

      if (task.isEditing) {
        renderEditMode(li, task);
      } else {
        renderNormalMode(li, task);
      }
      setupDragEvents(li, task.id);
      todoList.append(li);
    });
    };

    const deleteTask = (id) => {
      tasks = tasks.filter(t => t.id !== id);
      saveToStorage();
      renderTasks();
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = titleInput.value.trim();
      const dateVal = dateInput.value;
      if (val && dateVal) {
        addTask(val, dateVal);
        titleInput.value = '';
        dateInput.value = '';
      }
    });
    searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderTasks();
  });

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterStatus = btn.dataset.status;
      renderTasks();
    });
  });

  sortSelect.addEventListener('change', (e) => {
    sortOrder = e.target.value;
    renderTasks();
  });

  const toggleTaskStatus = (id) => {
      tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      saveToStorage();
      renderTasks();
    };

    const setEditMode = (id, status) => {
      tasks = tasks.map(t => t.id === id ? { ...t, isEditing: status } : t);
      renderTasks();
    };

    const saveEdit = (id, newTitle, newDate) => {
      if (!newTitle || !newDate) return;
      tasks = tasks.map(t => t.id === id ? { ...t, title: newTitle, date: newDate, isEditing: false } : t);
      saveToStorage();
      renderTasks();
    };

  const renderNormalMode = (li, task) => {
      const leftDiv = document.createElement('div');
      leftDiv.className = 'todo-left';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'todo-checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => toggleTaskStatus(task.id));

      const details = document.createElement('div');
      details.className = 'todo-details';

      const titleEl = document.createElement('span');
      titleEl.className = 'todo-text';
      titleEl.textContent = task.title;

      const dateEl = document.createElement('span');
      dateEl.className = 'todo-date';
      dateEl.textContent = `Срок: ${task.date}`;

      details.append(titleEl, dateEl);
      leftDiv.append(checkbox, details);

      const actions = document.createElement('div');
      actions.className = 'todo-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'btn btn-filter btn-sm';
      editBtn.textContent = 'Изменить';
      editBtn.addEventListener('click', () => setEditMode(task.id, true));

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-danger btn-sm';
      deleteBtn.textContent = 'Удалить';
      deleteBtn.addEventListener('click', () => deleteTask(task.id));

      actions.append(editBtn, deleteBtn);
      li.append(leftDiv, actions);
    };

    const renderEditMode = (li, task) => {
      const editForm = document.createElement('form');
      editForm.className = 'edit-form';

      const editTitle = document.createElement('input');
      editTitle.type = 'text';
      editTitle.className = 'input-field edit-input-title';
      editTitle.value = task.title;
      editTitle.required = true;

      const editDate = document.createElement('input');
      editDate.type = 'date';
      editDate.className = 'input-field edit-input-date';
      editDate.value = task.date;
      editDate.required = true;

      const saveBtn = document.createElement('button');
      saveBtn.type = 'submit';
      saveBtn.className = 'btn btn-primary btn-sm';
      saveBtn.textContent = 'Сохранить';

      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.className = 'btn btn-filter btn-sm';
      cancelBtn.textContent = 'Отмена';
      cancelBtn.addEventListener('click', () => setEditMode(task.id, false));

      editForm.append(editTitle, editDate, saveBtn, cancelBtn);

      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveEdit(task.id, editTitle.value.trim(), editDate.value);
      });

      li.append(editForm);
    };
  renderTasks();
});