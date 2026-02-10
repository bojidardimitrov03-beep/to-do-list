import Project from './project.js';

class AppLogic {
  constructor() {
    this.projects = [];
    this.projects.push(new Project('home'));
  }
  addProject(project){
    this.projects.push(project);
  }
  removeProject(index){
    this.projects.splice(index,1);
  }
  getProject(index){
    return this.projects[index];
  }
}

export default new AppLogic();