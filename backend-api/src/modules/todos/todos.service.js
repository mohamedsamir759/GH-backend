//

const { Cruds } = require('src/common/handlers');
const TodosModel = require('./todos.model');

class Todos extends Cruds {

}

module.exports = new Todos(TodosModel.Model, TodosModel.Schema);
