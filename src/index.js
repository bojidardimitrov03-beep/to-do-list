import appLogic from './appLogic';
import { loadData } from './storage';
import { renderProjects, renderTasks } from './domController';
import './styles.css';

import Project from './project';
import Todo from './todo';

const savedData = loadData();
if (savedData !== null) {
  appLogic.projects = savedData.projects.map((plainProject) => {
    const project = new Project(plainProject.name);
    project.tasks = plainProject.tasks.map((plainTodo) => {
      const todo = new Todo(
        plainTodo.title,
        plainTodo.description,
        plainTodo.dueDate,
        plainTodo.priority
      );
      todo.completed = !!plainTodo.completed;
      return todo;
    });
    return project;
  });
}
renderTasks();
renderProjects();
