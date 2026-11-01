document.addEventListener('DOMContentLoaded', () => {
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

  filters.forEach(f => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `btn btn-sm btn-filter ${f.value === 'all' ? 'active' : ''}`;
    btn.textContent = f.label;
    btn.dataset.status = f.value;
    filterGroup.append(btn);
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
});