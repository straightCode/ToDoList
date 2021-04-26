class ToDoList {
  constructor(toDoListEl) {
    this._toDoListEl = toDoListEl;
    this._toDoList = [];

    this.init();
  }

  init() {
    this._toDoListEl.on('click', '.delete', this, this._delToDoEl);
    this._toDoListEl.on('click', '.change', this, this._changeToDoEl);
    this._toDoListEl.on('click', '.list__item__content, .list__item__checkbox', this, this._checkToDoEl);

    this._showRemoteList();
  }
  _showRemoteList() {
    this._getToDoListFromServer()
      .then(response => {
        this._toDoList = response;
        this._renderList(this._toDoList);
      });
  }
  _getToDoListFromServer() {
    return fetch('https://retoolapi.dev/mqBTCx/todo')
      .then(response => response.json())
      .catch(err => console.log(err))
  }
  _renderList(list) {
    $(this._toDoListEl).html('');
    for (let i = 0; i < list.length; i++) {
      const html = `
      <li class="list__item ${list[i].completed ? 'checked' : ''}" id="${i}" data-id="${list[i].id}">
      <span class="list__item__index">${i + 1}) </span>
      <input type="text" class="list__item__content" value=" ${list[i].title}" readonly>
      ${list[i].completed ? '' : '<img src="img/pen.svg" class="change">'}
      <img src="img/trash.svg" class="delete">
      <input type="checkbox" id="checkbox" class="list__item__checkbox" ${list[i].completed ? 'checked' : ''}>
      </li>
      `;
      $(this._toDoListEl).append(html);
    }
  }
  _addToDo(item) {
    fetch('https://retoolapi.dev/mqBTCx/todo', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(item),
    }).then(() => this._showRemoteList());
  }
  _checkToDoEl(e) {
    const itemEl = $(e.target.parentElement);
    const index = itemEl.attr('id');
    const item = e.data._toDoList[index];

    // itemEl.toggleClass('checked'); ???
    // itemEl.children().last().attr('checked', !itemEl.children().last().attr('checked')) ???

    fetch(`https://retoolapi.dev/mqBTCx/todo/${item.id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        title: item.title,
        completed: !item.completed,
      })
    }).then(() => e.data._showRemoteList());
  }
  _delToDoEl(e) {
    const itemEl = $(e.target.parentElement);
    const id = itemEl.attr('data-id');
    $(itemEl).hide(400, function () {
      this.remove();
      fetch(`https://retoolapi.dev/mqBTCx/todo/${id}`, {
          method: 'DELETE'
        })
        .then(() => e.data._showRemoteList());
    });
  }
  _changeToDoEl(e){
  }
}