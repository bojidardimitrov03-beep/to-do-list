import appLogic from './appLogic';
import Todo from './todo';
import Project from './project';
import { saveData, loadData } from './storage';
import {format} from 'date-fns'

const addProjectBtn = document.getElementById("addNewProject");
const newTaskBtn = document.getElementById("newTask");
const calendarViewBtn = document.getElementById("calendar");

const highPriorityContainer = document.getElementById('highPriority-tasks');
const mediumPriorityContainer = document.getElementById('mediumPriority-tasks');
const lowPriorityContainer = document.getElementById('lowPriority-tasks');
const projectsContainer = document.getElementById('projects');
const taskModal = document.getElementById('taskModal');
const closeModalBtn = document.getElementById("cancelTask")
const priorityHeadings = document.querySelectorAll('.priority-heading');

let calendarOpen = false
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

    if (appLogic.projects.length === 0) {
      // Safety fallback: tasks require at least one project.
      appLogic.addProject(new Project('home'));
    }

    const todo = new Todo(title, description, dueDate, priority);
    appLogic.projects[0].addTask(todo);
    saveData(appLogic);

    taskModal.classList.add("hidden");
    taskForm.reset();
    if (calendarOpen) {
      renderCalendar();
    } else {
      renderTasks();
    }
  });

export const renderTasks = () => {
    highPriorityContainer.innerHTML = '';
    mediumPriorityContainer.innerHTML = '';
    lowPriorityContainer.innerHTML = '';

    if (appLogic.projects.length === 0) return;
  
    appLogic.projects[0].tasks.forEach((task,index) => {
      const taskDiv = document.createElement('div');
      taskDiv.classList.add('task-card');

      const taskHeader = document.createElement('div');
      taskHeader.classList.add('task-header');
  
      const taskTitle = document.createElement('span');
      taskTitle.classList.add('task-title');
      taskTitle.textContent = task.title;

      taskHeader.appendChild(taskTitle);
      taskDiv.appendChild(taskHeader);

      const taskDetails = document.createElement('div');
      taskDetails.classList.add('task-details', 'hidden');

      const taskDescription = document.createElement('p');
      taskDescription.classList.add('task-description');
      taskDescription.textContent = task.description;

      const taskDate = document.createElement('span');
      taskDate.classList.add('task-date');
      taskDate.textContent = `Due: ${task.dueDate}`;

      const taskPriority = document.createElement('span');
      taskPriority.classList.add('task-priority');
      taskPriority.textContent = `Priority: ${task.priority}`;

      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('delete-btn');
      deleteBtn.textContent = 'Delete';

      deleteBtn.addEventListener('click', () => {
        appLogic.projects[0].removeTask(index);
        saveData(appLogic);
        renderTasks();
      });

      taskDetails.appendChild(taskDescription);
      taskDetails.appendChild(taskDate);
      taskDetails.appendChild(taskPriority);
      taskDetails.appendChild(deleteBtn);

      taskDiv.appendChild(taskDetails);

      taskTitle.addEventListener('click', () => {
        taskDetails.classList.toggle('hidden');
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
    if (!name) return;
    const project = new Project(name);
    appLogic.addProject(project);
    saveData(appLogic);
    renderProjects();
  });

  export const renderProjects = () => {
    projectsContainer.innerHTML = '';
    appLogic.projects.forEach((project, index) => {
      const projectDiv = document.createElement('div');
      projectDiv.classList.add('project-item');

      const projectHeader = document.createElement('div');
      projectHeader.classList.add('project-header');

      const projectName = document.createElement('span');
      projectName.classList.add('project-name');
      projectName.textContent = project.name;

      projectHeader.appendChild(projectName);
      projectDiv.appendChild(projectHeader);

      const projectDetails = document.createElement('div');
      projectDetails.classList.add('project-details', 'hidden');

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete Project';
      deleteBtn.classList.add('project-delete-btn');
      deleteBtn.addEventListener('click', () => {
        if (appLogic.projects.length === 1) {
          alert('You must have at least one project.');
          return;
        }
        appLogic.removeProject(index);
        saveData(appLogic);
        renderProjects();
        renderTasks();
      });

      projectDetails.appendChild(deleteBtn);
      projectDiv.appendChild(projectDetails);

      projectName.addEventListener('click', () => {
        projectDetails.classList.toggle('hidden');
      });

      projectsContainer.appendChild(projectDiv);
    });
  };
  const calendarContainer = document.getElementById('calendarView');
  calendarViewBtn.addEventListener('click', () => {
    calendarOpen = !calendarOpen;
    if (calendarOpen) {
      highPriorityContainer.classList.add('hidden');
      mediumPriorityContainer.classList.add('hidden');
      lowPriorityContainer.classList.add('hidden');
      priorityHeadings.forEach((heading) => heading.classList.add('hidden'));
      calendarContainer.classList.remove('hidden');
      renderCalendar()
    } else {
      highPriorityContainer.classList.remove('hidden');
      mediumPriorityContainer.classList.remove('hidden');
      lowPriorityContainer.classList.remove('hidden');
      priorityHeadings.forEach((heading) => heading.classList.remove('hidden'));
      calendarContainer.classList.add('hidden');
    }
  });
  export const renderCalendar = () => {
    calendarContainer.innerHTML = '';

    if (appLogic.projects.length === 0) return;

    const groups = {};
    appLogic.projects[0].tasks.forEach((task) => {
      if (!groups[task.dueDate]) {
        groups[task.dueDate] = [];
      }
      groups[task.dueDate].push(task);
    });
  
    Object.keys(groups).forEach((date) => {
      const dateSection = document.createElement('div');
      dateSection.classList.add('calendar-date-section');
      
      const header = document.createElement('h3');
      header.classList.add('calendar-date-header');
      header.textContent = format(new Date(date), 'MMM dd yyyy');
      dateSection.appendChild(header);

      const dateDetails = document.createElement('div');
      dateDetails.classList.add('calendar-date-details');
  
      groups[date].forEach((task) => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('calendar-task');

        const taskHeader = document.createElement('div');
        taskHeader.classList.add('calendar-task-header');

        const taskTitle = document.createElement('span');
        taskTitle.classList.add('calendar-task-title');
        taskTitle.textContent = task.title;

        taskHeader.appendChild(taskTitle);
        taskDiv.appendChild(taskHeader);

        const taskDetails = document.createElement('div');
        taskDetails.classList.add('calendar-task-details', 'hidden');

        const taskDescription = document.createElement('p');
        taskDescription.textContent = task.description;

        const taskMeta = document.createElement('span');
        taskMeta.textContent = `Due: ${task.dueDate} • Priority: ${task.priority}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Delete';

        deleteBtn.addEventListener('click', () => {
          const idx = appLogic.projects[0].tasks.indexOf(task);
          if (idx !== -1) {
            appLogic.projects[0].removeTask(idx);
            saveData(appLogic);
            renderCalendar();
          }
        });

        taskDetails.appendChild(taskDescription);
        taskDetails.appendChild(taskMeta);
        taskDetails.appendChild(deleteBtn);

        taskDiv.appendChild(taskDetails);

        taskTitle.addEventListener('click', () => {
          taskDetails.classList.toggle('hidden');
        });

        dateDetails.appendChild(taskDiv);
      }); 

      dateSection.appendChild(dateDetails);
      calendarContainer.appendChild(dateSection);
    });
  };
