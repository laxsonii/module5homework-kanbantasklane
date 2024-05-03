// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Function to create a task card
function createTaskCard(task) {
  // Create a new task card element
  let card = $("<div>").addClass("task-card").attr("id", "task-" + task.id);
  card.html(`
    <div class="card mb-3">
      <div class="card-header">${task.title}</div>
      <div class="card-body">
        <p class="card-text">${task.description}</p>
        <p class="card-text">${task.dueDate}</p>
        <button class="btn btn-danger delete-btn">Delete</button>
      </div>
    </div>
  `);
  return card;
}

// Function to render the task list and make cards draggable
function renderTaskList() {
  // Clear existing task cards
  $(".lane .card-body").empty();
  
  // Loop through taskList and create task cards
  taskList.forEach(task => {
    let card = createTaskCard(task);
    // Append the task card to the appropriate lane
    $("#" + task.status + "-cards").append(card);
  });

  // Make task cards draggable
  $(".task-card").draggable({
    revert: "invalid",
    stack: ".task-card",
    cursor: "move",
  });
}

// Function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  let title = $("#title").val();
  let description = $("#description").val();
  let dueDate = $("#due-date").val();
  let status = "to-do"; // Default status is "To Do"
  let id = generateTaskId();

  // Create a new task object
  let task = {
    id: id,
    title: title,
    description: description,
    dueDate: dueDate,
    status: status
  };

  // Add the task to the task list
  taskList.push(task);

  // Save the updated task list to localStorage
  localStorage.setItem("tasks", JSON.stringify(taskList));
  
  // Update nextId in localStorage
  localStorage.setItem("nextId", JSON.stringify(nextId));

  // Render the updated task list
  renderTaskList();

  // Reset form fields
  $("#title").val("");
  $("#description").val("");
  $("#due-date").val("");
  $("#formModal").modal("hide");
}

// Function to handle deleting a task
function handleDeleteTask(event) {
  let taskId = $(event.target).closest(".task-card").attr("id").split("-")[1];
  taskList = taskList.filter(task => task.id != taskId);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  let taskId = ui.draggable.attr("id").split("-")[1];
  let newStatus = $(this).attr("id").split("-")[0];
  let taskIndex = taskList.findIndex(task => task.id == taskId);
  taskList[taskIndex].status = newStatus;
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList();

  // Add event listener for adding task
  $("#addTaskForm").on("submit", handleAddTask);

  // Add event listener for deleting task
  $("body").on("click", ".delete-btn", handleDeleteTask);

  // Make lanes droppable
  $(".lane").droppable({
    accept: ".task-card",
    drop: handleDrop,
  });

  // Make due date field a date picker
  $("#due-date").datepicker();
});