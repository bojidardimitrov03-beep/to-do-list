export default class Project {
    constructor(name) {
      this.name = name;
      this.tasks = [];
    }
  
    addTask(todo) {
      this.tasks.push(todo);
    }
  
    removeTask(index) {
      this.tasks.splice(index, 1);
    }
  
    getTask(index) {
      return this.tasks[index];
    }
  }