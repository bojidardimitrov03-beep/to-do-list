import appLogic from './appLogic';
import { loadData } from './storage';
import { renderProjects, renderTasks } from './domController';
import './style.css';

const savedData = loadData();
if (savedData !== null) {
  appLogic.projects = savedData.projects;
}

renderTasks();
renderProjects();
