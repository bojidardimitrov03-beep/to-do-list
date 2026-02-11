import appLogic from './appLogic';
import { loadData } from './storage';
import { renderProjects, renderTasks } from './domController';
import './layout.css';
import './components.css';
import Project from './project';
import Todo from './todo';

const savedData = loadData();
if (savedData !== null) {
  appLogic.projects = savedData.projects.map((plainProject) => {
    const project = new Project(plainProject.name);
    project.tasks = plainProject.tasks.map((plainTodo) => {
      return new Todo(
        plainTodo.title,
        plainTodo.description,
        plainTodo.dueDate,
        plainTodo.priority
      );
    });
    return project;
  });
}
renderTasks();
renderProjects();
