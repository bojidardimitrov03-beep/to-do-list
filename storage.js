const saveData = (appLogic) => {
    localStorage.setItem('todoApp', JSON.stringify(appLogic));
  }
  
  const loadData = () => {
    const data = localStorage.getItem('todoApp');
    if (data === null) {
      return null;
    } else {
      return JSON.parse(data);
    }
  }
  
  export { saveData, loadData };