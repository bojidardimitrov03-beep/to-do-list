import appLogic from './appLogic';
import Todo from './todo';
import Project from './project';
import { saveData, loadData } from './storage';

const addProjectBtn = document.getElementById("addNewProject");
const newTaskBtn = document.getElementById("newTask");
const calendarViewBtn = document.getElementById("calendar");

const highPriorityContainer = document.getElementById('highPriority-tasks');
const mediumPriorityContainer = document.getElementById('mediumPriority-tasks');
const lowPriorityContainer = document.getElementById('lowPriority-tasks');
const projectsContainer = document.getElementById('projects');
const taskModal = document.getElementById('taskModal');
const closeModalBtn = document.getElementById("cancelTask")


newTaskBtn.addEventListener('click', () => {
    taskModal.classList.remove('hidden');
  });

closeModalBtn.addEventListener("click",  ()=> {
    taskModal.classList.add("hidden");

})

const taskForm = document.getElementById('taskForm');

taskForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
  
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;

    const todo = new Todo(title, description, dueDate, priority);
    appLogic.projects[0].addTask(todo);
    saveData(appLogic);

    taskModal.classList.add("hidden");
    renderTasks();
  });

export const renderTasks = () => {
    highPriorityContainer.innerHTML = '';
    mediumPriorityContainer.innerHTML = '';
    lowPriorityContainer.innerHTML = '';
  
    appLogic.projects[0].tasks.forEach((task,index) => {
        const taskDiv = document.createElement('div');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete Task';
        taskDiv.textContent = `${task.title} - ${task.dueDate}`;
        taskDiv.appendChild(deleteBtn);  // button goes inside card
        deleteBtn.addEventListener('click', () => {
            appLogic.projects[0].removeTask(index);
            saveData(appLogic);
            renderTasks();
          });
        if (task.priority === 'high') {
          highPriorityContainer.appendChild(taskDiv);
        } else if (task.priority === 'medium') {
          mediumPriorityContainer.appendChild(taskDiv);
        } else if (task.priority === 'low') {
          lowPriorityContainer.appendChild(taskDiv);
        }
    });
  };

  addProjectBtn.addEventListener('click', () => {
    const name = prompt('Enter project name:');
    const project = new Project(name);
    appLogic.addProject(project);
    saveData(appLogic);
    renderProjects();
  });

  export const renderProjects = () => {
    projectsContainer.innerHTML = '';
    appLogic.projects.forEach((project, index) => {
      const projectDiv = document.createElement('div');
      
      const projectName = document.createElement('span');
      projectName.textContent = project.name;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete Project';
      deleteBtn.addEventListener('click', () => {
        appLogic.removeProject(index);
        saveData(appLogic);
        renderProjects();
      });
  
      projectDiv.appendChild(projectName);
      projectDiv.appendChild(deleteBtn);
      projectsContainer.appendChild(projectDiv);
    });
  };

