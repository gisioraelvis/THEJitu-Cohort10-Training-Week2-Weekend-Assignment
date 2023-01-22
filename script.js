// Grab DOM Elements
const form = document.querySelector(".form");
const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const dateInput = document.querySelector("#date");
const markAllTasksAsCompletedBtn = document.querySelector(
  "#mark-all-completed"
);
const deleteAllCompletedTasksBtn = document.querySelector(
  "#delete-all-completed"
);
const tasks = document.querySelector(".tasks");
const task = document.querySelector(".task");
const taskTitle = document.querySelector(".task-header h3");
const taskDescription = document.querySelector(".task-body p:first-child");
const taskDate = document.querySelector(".task-body p:last-child");
const taskCompleteCheckbox = document.querySelector("#toggle-task-complete");
const taskEditBtn = document.querySelector("#edit-task");
const taskDeleteBtn = document.querySelector("#delete-task");

// Tasks as array of objects, stored in local storage
let storedTasks = localStorage.getItem("storedTasks")
  ? JSON.parse(localStorage.getItem("storedTasks"))
  : [];

// Event Listeners
form.addEventListener("submit", addTask);
markAllTasksAsCompletedBtn.addEventListener("click", markAllTasksAsCompleted);
deleteAllCompletedTasksBtn.addEventListener("click", deleteAllCompletedTasks);

// Via event delegation because the task buttons are dynamically created
tasks.addEventListener("click", function (e) {
  if (e.target.matches("#toggle-task-complete")) {
    toggleTaskComplete(e);
  }
  if (e.target.matches("#edit-task")) {
    editTask(e);
  }
  if (e.target.matches("#delete-task")) {
    deleteTask(e);
  }
});

// hide the "Mark All Tasks As Completed" and "Delete All Completed Tasks" buttons if tasks < 2
if (storedTasks.length < 2) {
  markAllTasksAsCompletedBtn.style.display = "none";
  deleteAllCompletedTasksBtn.style.display = "none";
}

// disable "Delete All Completed Tasks" button no tasks are marked completed
if (storedTasks.every((task) => task.completed === false)) {
  deleteAllCompletedTasksBtn.disabled = true;
  deleteAllCompletedTasksBtn.classList.add("disabled");
}

// disable the "Mark All Tasks As Completed" button if all tasks are already marked as completed
if (storedTasks.every((task) => task.completed === true)) {
  markAllTasksAsCompletedBtn.disabled = true;
  markAllTasksAsCompletedBtn.classList.add("disabled");
}

// on page load, show tasks
showTasks();

// Add Task
function addTask(e) {
  e.preventDefault();
  const task = {
    id: Date.now(),
    title: titleInput.value,
    description: descriptionInput.value,
    date: dateInput.value,
    completed: false,
    completedDate: null,
  };
  storedTasks.unshift(task);
  localStorage.setItem("storedTasks", JSON.stringify(storedTasks));
  showTasks();

  // clear input fields
  titleInput.value = "";
  descriptionInput.value = "";
  dateInput.value = "";

  // show the "Mark All Tasks As Completed" and "Delete All Completed Tasks" buttons if tasks > 1
  if (storedTasks.length > 1) {
    markAllTasksAsCompletedBtn.style.display = "block";
    markAllTasksAsCompletedBtn.classList.remove("disabled");
    deleteAllCompletedTasksBtn.style.display = "block";
  }
}

// Show Tasks, filtered by uncompleted and completed
function showTasks() {
  tasks.innerHTML = "";
  // Filter uncompleted tasks
  const uncompletedTasks = storedTasks.filter((task) => !task.completed);
  // Filter completed tasks
  const completedTasks = storedTasks.filter((task) => task.completed);

  // If there are uncompleted tasks
  if (uncompletedTasks.length > 0) {
    // Create a heading for uncompleted tasks
    tasks.innerHTML += `<h2>Uncompleted Tasks</h2>`;
    // Loop through uncompleted tasks and display them
    uncompletedTasks.forEach((task) => {
      tasks.innerHTML += `
          <div class="task" id="${task.id}">
            <div class="task-header">
              <h3>${task.title}</h3>
              <div class="task-actions">
                  <button class="btn edit" id="edit-task">Edit</button>
              </div>
            </div>
            <div class="task-body">
              <p>${task.description}</p>
              <p>Due Date: ${new Date(task.date).toLocaleDateString("EAT", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              })}</p>
            </div>
            <div class="task-footer">
              <div class="complete-checkbox">
                <label for="complete">Completed:</label>
                <input type="checkbox" name="complete" id="toggle-task-complete">
              </div>
                <div class="delete-btn">
                  <button class="btn delete" id="delete-task">Delete</button>
              </div>
            </div>
          </div>`;
    });
  }

  // If there are completed tasks, show tasks that were completed on time or late
  // and by how many mins, hrs, days, weeks, months, years
  if (completedTasks.length > 0) {
    // Create a heading for completed tasks
    tasks.innerHTML += `<h2>Completed Tasks</h2>`;
    // Loop through completed tasks and display them
    completedTasks.forEach((task) => {
      let completedDate = new Date(task.completedDate);
      let dueDate = new Date(task.date);
      let timeDiff = completedDate - dueDate;
      let timeString = "";

      if (timeDiff > 0) {
        timeString += "Late by: ";
      } else {
        timeString += "Completed on time by: ";
        timeDiff = -timeDiff;
      }

      let seconds = Math.floor((timeDiff / 1000) % 60);
      let minutes = Math.floor((timeDiff / 1000 / 60) % 60);
      let hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
      let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      let weeks = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));
      let months = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30));
      let years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365));

      if (days > 0) {
        timeString += `${days} day${days > 1 ? "s" : ""} `;
      }
      if (hours > 0) {
        timeString += `${hours} hour${hours > 1 ? "s" : ""} `;
      }
      if (minutes > 0) {
        timeString += `${minutes} minute${minutes > 1 ? "s" : ""} `;
      }
      if (seconds > 0) {
        timeString += `${seconds} second${seconds > 1 ? "s" : ""} `;
      }
      if (weeks > 0) {
        timeString += `${weeks} week${weeks > 1 ? "s" : ""} `;
      }
      if (months > 0) {
        timeString += `${months} month${months > 1 ? "s" : ""} `;
      }
      if (years > 0) {
        timeString += `${years} year${years > 1 ? "s" : ""} `;
      }

      tasks.innerHTML += `
        <div class="task completed" id="${task.id}">
          <div class="task-header">
            <h3>${task.title}</h3>
            <div class="task-actions">
                <button class="btn edit disabled" id="edit-task">Edit</button>
            </div>
          </div>
          <div class="task-body">
            <p>${task.description}</p>
            <p>Due Date: ${
              // Format: Sun Jan 22 2023 21:28:59 PM
              dueDate.toLocaleString("EAT", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              })
            }</p>
          </div>
          <div class="task-footer">
            <div class="task-time">
              <p>Completed Date: ${
                // Format: Sun Jan 22 2023 21:28:59 PM
                completedDate.toLocaleString("EAT", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                })
              }</p>
              <p
              class=${completedDate - dueDate > 0 ? "task-late" : "task-ontime"}s
              >${timeString}</p>
            </div>
            <div class="complete-checkbox">
              <label for="complete">Completed:</label>
              <input type="checkbox" name="complete" id="toggle-task-complete" checked>
            </div>
              <div class="delete-btn">
                <button class="btn delete" id="delete-task">Delete</button>
              </div>
          </div>
        </div>`;
    });
  }

  // If there are no tasks
  if (!completedTasks.length && !uncompletedTasks.length) {
    tasks.innerHTML += `
    <div class="no-tasks">
      <h3>No task found, why not add some tasks today!</h3>
    </div>
    `;
  }
}

// Toggle Task Completed (Mark or Unmark as Completed)
function toggleTaskComplete(e) {
  const task = e.target.closest(".task");
  const taskId = task.id;
  const taskToToggle = storedTasks.find((task) => task.id == taskId);
  taskToToggle.completed = !taskToToggle.completed;
  if (taskToToggle.completed) {
    taskToToggle.completedDate = new Date();
  } else {
    taskToToggle.completedDate = null;
  }
  localStorage.setItem("storedTasks", JSON.stringify(storedTasks));

  // update the "Mark All Tasks As Completed" button appropriately
  // i.e if all tasks are completed, disable the button else enable it
  if (storedTasks.every((task) => task.completed === true)) {
    markAllTasksAsCompletedBtn.classList.add("disabled");
  } else {
    markAllTasksAsCompletedBtn.classList.remove("disabled");
  }

  // update the "Delete All Completed Tasks" button appropriately
  // i.e if all tasks are completed, enable the button else disable it
  if (storedTasks.every((task) => task.completed === false)) {
    deleteAllCompletedTasksBtn.classList.add("disabled");
  } else {
    deleteAllCompletedTasksBtn.classList.remove("disabled");
  }

  showTasks();
}

// Edit Task (Update Task)
function editTask(e) {
  const task = e.target.closest(".task");
  const taskId = task.id;
  const taskToEdit = storedTasks.find((task) => task.id == taskId);
  titleInput.value = taskToEdit.title;
  descriptionInput.value = taskToEdit.description;
  dateInput.value = taskToEdit.date;
  storedTasks = storedTasks.filter((task) => task.id != taskId);
  localStorage.setItem("storedTasks", JSON.stringify(storedTasks));
  showTasks();
}

// Delete Task
function deleteTask(e) {
  const task = e.target.closest(".task");
  const taskId = task.id;
  storedTasks = storedTasks.filter((task) => task.id != taskId);
  localStorage.setItem("storedTasks", JSON.stringify(storedTasks));
  showTasks();
}

// Mark All Tasks as Completed
function markAllTasksAsCompleted() {
  storedTasks = storedTasks.map((task) => {
    task.completed = true;
    return task;
  });
  localStorage.setItem("storedTasks", JSON.stringify(storedTasks));
  showTasks();

  markAllTasksAsCompletedBtn.classList.add("disabled");
  deleteAllCompletedTasksBtn.classList.remove("disabled");
  taskEditBtn.classList.add("disabled");
}

// Delete All Completed Tasks
function deleteAllCompletedTasks() {
  storedTasks = storedTasks.filter((task) => !task.completed);
  localStorage.setItem("storedTasks", JSON.stringify(storedTasks));
  showTasks();

  // hide the "Mark All Tasks as Completed" and "Delete All Completed Tasks" buttons
  markAllTasksAsCompletedBtn.style.display = "none";
  deleteAllCompletedTasksBtn.style.display = "none";
}

// if no Completed /uncompleted show a message
if (storedTasks.length === 0) {
  tasks.innerHTML = "";
  tasks.innerHTML = `
    <div class="no-tasks">
      <h3>No task found, why not add some tasks today!</h3>
    </div>
  `;
}
