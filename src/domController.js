import { format } from "date-fns";
import appLogic from "./appLogic";
import Project from "./project";
import { saveData } from "./storage";
import Todo from "./todo";

const addProjectBtn = document.getElementById("addNewProject");
const newTaskBtn = document.getElementById("newTask");
const calendarViewBtn = document.getElementById("calendar");
const todaySidebar = document.getElementById("todaySidebar");
const completedSidebar = document.getElementById("completedSidebar");
const projectsHeading = document.getElementById("projectsHeading");

const tasksContainer = document.getElementById("tasks");
const projectsContainer = document.getElementById("projects");
const taskModal = document.getElementById("taskModal");
const closeModalBtn = document.getElementById("cancelTask");
const todayHeading = document.getElementById("todayHeading");
const todayContainer = document.getElementById("today-tasks");
const completedHeading = document.getElementById("completedHeading");
const completedContainer = document.getElementById("completed-tasks");

let calendarOpen = false;
let todayOpen = false;
let completedOpen = false;

// Ensure projects list starts collapsed, even if HTML/CSS cache is stale
projectsContainer.classList.add("hidden");
newTaskBtn.addEventListener("click", () => {
  taskModal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
  taskModal.classList.add("hidden");
});

const taskForm = document.getElementById("taskForm");

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDescription").value;
  const dueDate = document.getElementById("taskDueDate").value;
  const priority = document.getElementById("taskPriority").value;

  if (appLogic.projects.length === 0) {
    // Safety fallback: tasks require at least one project.
    appLogic.addProject(new Project("home"));
  }

  const todo = new Todo(title, description, dueDate, priority);
  appLogic.projects[0].addTask(todo);
  saveData(appLogic);

  taskModal.classList.add("hidden");
  taskForm.reset();
  if (calendarOpen) {
    renderCalendar();
  } else if (todayOpen) {
    renderToday();
  } else {
    renderTasks();
  }
});

export const renderTasks = () => {
  tasksContainer.innerHTML = "";

  if (appLogic.projects.length === 0) return;

  appLogic.projects[0].tasks.forEach((task, index) => {
    if (task.completed) return;

    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task-card");

    if (task.priority === "high") {
      taskDiv.classList.add("priority-high");
    } else if (task.priority === "medium") {
      taskDiv.classList.add("priority-medium");
    } else if (task.priority === "low") {
      taskDiv.classList.add("priority-low");
    }

    const taskHeader = document.createElement("div");
    taskHeader.classList.add("task-header");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("task-checkbox");
    checkbox.checked = !!task.completed;

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveData(appLogic);
      if (calendarOpen) {
        renderCalendar();
      } else if (todayOpen) {
        renderToday();
      } else if (completedOpen) {
        renderCompleted();
      } else {
        renderTasks();
      }
    });

    const taskTitle = document.createElement("span");
    taskTitle.classList.add("task-title");
    taskTitle.textContent = task.title;

    taskHeader.appendChild(checkbox);
    taskHeader.appendChild(taskTitle);
    taskDiv.appendChild(taskHeader);

    const taskDetails = document.createElement("div");
    taskDetails.classList.add("task-details", "hidden");

    const taskDescription = document.createElement("p");
    taskDescription.classList.add("task-description");
    taskDescription.textContent = task.description;

    const taskDate = document.createElement("span");
    taskDate.classList.add("task-date");
    taskDate.textContent = `Due: ${task.dueDate}`;

    const taskPriority = document.createElement("span");
    taskPriority.classList.add("task-priority");
    taskPriority.textContent = `Priority: ${task.priority}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => {
      appLogic.projects[0].removeTask(index);
      saveData(appLogic);
      renderTasks();
    });

    taskDetails.appendChild(taskDescription);
    taskDetails.appendChild(taskDate);
    taskDetails.appendChild(taskPriority);
    taskDetails.appendChild(deleteBtn);

    taskDiv.appendChild(taskDetails);

    taskTitle.addEventListener("click", () => {
      taskDetails.classList.toggle("hidden");
    });

    tasksContainer.appendChild(taskDiv);
  });
};

addProjectBtn.addEventListener("click", () => {
  const name = prompt("Enter project name:");
  if (!name) return;
  const project = new Project(name);
  appLogic.addProject(project);
  saveData(appLogic);
  renderProjects();
});

export const renderProjects = () => {
  projectsContainer.innerHTML = "";
  appLogic.projects.forEach((project, index) => {
    const projectDiv = document.createElement("div");
    projectDiv.classList.add("project-item");

    const projectHeader = document.createElement("div");
    projectHeader.classList.add("project-header");

    const projectName = document.createElement("span");
    projectName.classList.add("project-name");
    projectName.textContent = project.name;

    projectHeader.appendChild(projectName);
    projectDiv.appendChild(projectHeader);

    const projectDetails = document.createElement("div");
    projectDetails.classList.add("project-details", "hidden");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete Project";
    deleteBtn.classList.add("project-delete-btn");
    deleteBtn.addEventListener("click", () => {
      if (appLogic.projects.length === 1) {
        alert("You must have at least one project.");
        return;
      }
      appLogic.removeProject(index);
      saveData(appLogic);
      renderProjects();
      renderTasks();
    });

    projectDetails.appendChild(deleteBtn);
    projectDiv.appendChild(projectDetails);

    projectName.addEventListener("click", () => {
      projectDetails.classList.toggle("hidden");
    });

    projectsContainer.appendChild(projectDiv);
  });
};

const calendarContainer = document.getElementById("calendarView");

todaySidebar.addEventListener("click", () => {
  todayOpen = !todayOpen;

  if (todayOpen) {
    calendarOpen = false;
    completedOpen = false;
    calendarContainer.classList.add("hidden");

    todaySidebar.classList.add("sidebar-active");
    calendarViewBtn.classList.remove("sidebar-active");
    completedSidebar.classList.remove("sidebar-active");

    tasksContainer.classList.add("hidden");
    completedHeading.classList.add("hidden");
    completedContainer.classList.add("hidden");

    todayHeading.classList.remove("hidden");
    todayContainer.classList.remove("hidden");
    renderToday();
  } else {
    todaySidebar.classList.remove("sidebar-active");

    todayHeading.classList.add("hidden");
    todayContainer.classList.add("hidden");

    tasksContainer.classList.remove("hidden");
  }
});
calendarViewBtn.addEventListener("click", () => {
  calendarOpen = !calendarOpen;
  if (calendarOpen) {
    todayOpen = false;
    completedOpen = false;
    todaySidebar.classList.remove("sidebar-active");
    completedSidebar.classList.remove("sidebar-active");
    calendarViewBtn.classList.add("sidebar-active");
    todayHeading.classList.add("hidden");
    todayContainer.classList.add("hidden");
    completedHeading.classList.add("hidden");
    completedContainer.classList.add("hidden");

    tasksContainer.classList.add("hidden");
    calendarContainer.classList.remove("hidden");
    renderCalendar();
  } else {
    calendarViewBtn.classList.remove("sidebar-active");
    tasksContainer.classList.remove("hidden");
    calendarContainer.classList.add("hidden");
  }
});

projectsHeading.addEventListener("click", () => {
  // Toggle visibility of the projects list
  if (projectsContainer) {
    projectsContainer.classList.toggle("hidden");
  }
});

completedSidebar.addEventListener("click", () => {
  completedOpen = !completedOpen;

  if (completedOpen) {
    todayOpen = false;
    calendarOpen = false;

    todaySidebar.classList.remove("sidebar-active");
    calendarViewBtn.classList.remove("sidebar-active");
    completedSidebar.classList.add("sidebar-active");

    todayHeading.classList.add("hidden");
    todayContainer.classList.add("hidden");
    calendarContainer.classList.add("hidden");
    tasksContainer.classList.add("hidden");

    completedHeading.classList.remove("hidden");
    completedContainer.classList.remove("hidden");
    renderCompleted();
  } else {
    completedSidebar.classList.remove("sidebar-active");
    completedHeading.classList.add("hidden");
    completedContainer.classList.add("hidden");
    tasksContainer.classList.remove("hidden");
  }
});

export const renderToday = () => {
  todayContainer.innerHTML = "";

  if (appLogic.projects.length === 0) return;

  const today = format(new Date(), "yyyy-MM-dd");

  appLogic.projects[0].tasks.forEach((task, index) => {
    if (task.dueDate !== today || task.completed) return;

    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task-card");

    const taskHeader = document.createElement("div");
    taskHeader.classList.add("task-header");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("task-checkbox");
    checkbox.checked = !!task.completed;

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveData(appLogic);
      if (calendarOpen) {
        renderCalendar();
      } else if (todayOpen) {
        renderToday();
      } else if (completedOpen) {
        renderCompleted();
      } else {
        renderTasks();
      }
    });

    const taskTitle = document.createElement("span");
    taskTitle.classList.add("task-title");
    taskTitle.textContent = task.title;

    taskHeader.appendChild(checkbox);
    taskHeader.appendChild(taskTitle);
    taskDiv.appendChild(taskHeader);

    const taskDetails = document.createElement("div");
    taskDetails.classList.add("task-details", "hidden");

    const taskDescription = document.createElement("p");
    taskDescription.classList.add("task-description");
    taskDescription.textContent = task.description;

    const taskDate = document.createElement("span");
    taskDate.classList.add("task-date");
    taskDate.textContent = `Due: ${task.dueDate}`;

    const taskPriority = document.createElement("span");
    taskPriority.classList.add("task-priority");
    taskPriority.textContent = `Priority: ${task.priority}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => {
      appLogic.projects[0].removeTask(index);
      saveData(appLogic);
      renderToday();
    });

    taskDetails.appendChild(taskDescription);
    taskDetails.appendChild(taskDate);
    taskDetails.appendChild(taskPriority);
    taskDetails.appendChild(deleteBtn);

    taskDiv.appendChild(taskDetails);

    taskTitle.addEventListener("click", () => {
      taskDetails.classList.toggle("hidden");
    });

    todayContainer.appendChild(taskDiv);
  });
};

export const renderCompleted = () => {
  completedContainer.innerHTML = "";

  if (appLogic.projects.length === 0) return;

  appLogic.projects[0].tasks.forEach((task, index) => {
    if (!task.completed) return;

    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task-card");

    if (task.priority === "high") {
      taskDiv.classList.add("priority-high");
    } else if (task.priority === "medium") {
      taskDiv.classList.add("priority-medium");
    } else if (task.priority === "low") {
      taskDiv.classList.add("priority-low");
    }

    const taskHeader = document.createElement("div");
    taskHeader.classList.add("task-header");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("task-checkbox");
    checkbox.checked = !!task.completed;

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveData(appLogic);
      if (completedOpen) {
        renderCompleted();
      } else if (calendarOpen) {
        renderCalendar();
      } else if (todayOpen) {
        renderToday();
      } else {
        renderTasks();
      }
    });

    const taskTitle = document.createElement("span");
    taskTitle.classList.add("task-title");
    taskTitle.textContent = task.title;

    taskHeader.appendChild(checkbox);
    taskHeader.appendChild(taskTitle);
    taskDiv.appendChild(taskHeader);

    const taskDetails = document.createElement("div");
    taskDetails.classList.add("task-details", "hidden");

    const taskDescription = document.createElement("p");
    taskDescription.classList.add("task-description");
    taskDescription.textContent = task.description;

    const taskDate = document.createElement("span");
    taskDate.classList.add("task-date");
    taskDate.textContent = `Due: ${task.dueDate}`;

    const taskPriority = document.createElement("span");
    taskPriority.classList.add("task-priority");
    taskPriority.textContent = `Priority: ${task.priority}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => {
      appLogic.projects[0].removeTask(index);
      saveData(appLogic);
      renderCompleted();
    });

    taskDetails.appendChild(taskDescription);
    taskDetails.appendChild(taskDate);
    taskDetails.appendChild(taskPriority);
    taskDetails.appendChild(deleteBtn);

    taskDiv.appendChild(taskDetails);

    taskTitle.addEventListener("click", () => {
      taskDetails.classList.toggle("hidden");
    });

    completedContainer.appendChild(taskDiv);
  });
};

export const renderCalendar = () => {
  calendarContainer.innerHTML = "";

  if (appLogic.projects.length === 0) return;

  const groups = {};
  appLogic.projects[0].tasks.forEach((task) => {
    if (task.completed) return;
    if (!groups[task.dueDate]) {
      groups[task.dueDate] = [];
    }
    groups[task.dueDate].push(task);
  });

  Object.keys(groups).forEach((date) => {
    const dateSection = document.createElement("div");
    dateSection.classList.add("calendar-date-section");

    const header = document.createElement("h3");
    header.classList.add("calendar-date-header");
    header.textContent = format(new Date(date), "MMM dd yyyy");
    dateSection.appendChild(header);

    const dateDetails = document.createElement("div");
    dateDetails.classList.add("calendar-date-details");

    groups[date].forEach((task) => {
      const taskDiv = document.createElement("div");
      taskDiv.classList.add("calendar-task");

      if (task.priority === "high") {
        taskDiv.classList.add("priority-high");
      } else if (task.priority === "medium") {
        taskDiv.classList.add("priority-medium");
      } else if (task.priority === "low") {
        taskDiv.classList.add("priority-low");
      }

      const taskHeader = document.createElement("div");
      taskHeader.classList.add("calendar-task-header");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("task-checkbox");
      checkbox.checked = !!task.completed;

      checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveData(appLogic);
        if (calendarOpen) {
          renderCalendar();
        } else if (todayOpen) {
          renderToday();
        } else if (completedOpen) {
          renderCompleted();
        } else {
          renderTasks();
        }
      });

      const taskTitle = document.createElement("span");
      taskTitle.classList.add("calendar-task-title");
      taskTitle.textContent = task.title;

      taskHeader.appendChild(checkbox);
      taskHeader.appendChild(taskTitle);
      taskDiv.appendChild(taskHeader);

      const taskDetails = document.createElement("div");
      taskDetails.classList.add("calendar-task-details", "hidden");

      const taskDescription = document.createElement("p");
      taskDescription.textContent = task.description;

      const taskMeta = document.createElement("span");
      taskMeta.textContent = `Due: ${task.dueDate} • Priority: ${task.priority}`;

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "Delete";

      deleteBtn.addEventListener("click", () => {
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

      taskTitle.addEventListener("click", () => {
        taskDetails.classList.toggle("hidden");
      });

      dateDetails.appendChild(taskDiv);
    });

    dateSection.appendChild(dateDetails);
    calendarContainer.appendChild(dateSection);
  });
};
