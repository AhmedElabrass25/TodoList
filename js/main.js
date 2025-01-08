const addBtn = document.getElementById("addBtn");
const deleteTask = document.getElementById("deleteTask");
const todoInput = document.getElementById("todoInput");
const loadingPage = document.querySelector(".loading");
let tasksContainer = document.getElementById("taskContainer");
const apiKey = "6761506d60a208ee1fde3b62";
// progressBar items>>>>>>>>>>>>>>>>
const progressBar = document.querySelector(".progressBar");
const bar = document.querySelector(".bar");
const numOfCompletedTasks = document.getElementById("numOfCompletedTasks");
const numOfTasks = document.getElementById("numOfTasks");
// progressBar items>>>>>>>>>>>>>>>>

let allTasks = [];
getAllTodos();
addBtn.addEventListener("click", (e) => {
  addTodo();
});
async function addTodo() {
  if (todoInput.value.trim() !== "") {
    showLoading();
    let obj = {
      title: todoInput.value,
      apiKey: apiKey,
    };
    // console.log(obj);
    const res = await fetch("https://todos.routemisr.com/api/v1/todos", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "content-type": "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.message === "success") {
        toastr.success("The task is added successfully ", {
          timeOut: 3000,
        });
        getAllTodos();
      }
    }
  } else {
    // document.getElementById("errorMsg").classList.remove("d-none");
    toastr.error("Please fill your field ........!", "Enter your task", {
      timeOut: 3000,
    });
  }
  todoInput.value = null;
  hideLoading();
}
async function getAllTodos() {
  showLoading(); //show loading page
  const res = await fetch(`https://todos.routemisr.com/api/v1/todos/${apiKey}`); //it is (GET) default ;
  if (res.ok) {
    const data = await res.json(); //{message:"success",todos:[{},{}]}
    if (data.message === "success") {
      allTasks = data.todos;
      displayData();
      console.log(allTasks);
    }
  }
  hideLoading(); //hide loading page
}
function displayData() {
  if (allTasks.length > 0) {
    let package = "";
    for (const item of allTasks) {
      package += `
            <li class="w-100 dFlex justify-content-between">
                  <span
                  onclick="completedTask('${item._id}')" 
                  class="taskName ${item.completed ? "completed" : ""}">${
        item.title
      }</span>
                  <div class="">

                  ${
                    item.completed
                      ? ` <span class="checkIcon text-success">
                        <i class="fa-regular fa-circle-check"></i>
                      </span>`
                      : ""
                  }

                  <span id="deleteTask" class="ms-2" onclick="deleteTaskFunc('${
                    item._id
                  }')">
                        <i class="fa-solid fa-trash-can"></i>
                  </span>
                  </div>

                </li>
    
    `;
    }
    tasksContainer.innerHTML = package;
    progressBarFunc();
  } else {
    tasksContainer.innerHTML = `<h3 class="w-100 text-center text-secondary">There is no tasks...........!</h3>`;
    progressBarFunc();
  }
}
async function deleteTaskFunc(itemId) {
  Swal.fire({
    title: "Are you want to delete it ?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it...!",
  }).then(async (result) => {
    //>>>>>>>>>>>>><<<<<<
    // code of delete task
    //>>>>>>>>>>>>><<<<<<
    if (result.isConfirmed) {
      showLoading(); //show loading page
      const obj = {
        todoId: itemId,
      };
      const res = await fetch("https://todos.routemisr.com/api/v1/todos", {
        method: "DELETE",
        body: JSON.stringify(obj),
        headers: {
          "content-type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.message === "success") {
          Swal.fire({
            title: "Deleted!",
            text: "Your task has been deleted.",
            icon: "success",
          });
          getAllTodos(); // get all todos  and display it.
        }
      }
      //>>>>>>>>>>>>><<<<<<
      // code of delete task
      //>>>>>>>>>>>>><<<<<<
      hideLoading();
    }
  });
}
async function completedTask(itemId) {
  Swal.fire({
    title: "Did you complete it ?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, I completed it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      showLoading(); //show loading page
      const obj = {
        todoId: itemId,
      };
      const res = await fetch("https://todos.routemisr.com/api/v1/todos", {
        method: "PUT",
        body: JSON.stringify(obj),
        headers: {
          "content-type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.message === "success") {
          Swal.fire({
            title: "completed!",
            text: "Your todo has been completed.",
            icon: "success",
          });
          getAllTodos(); //get all todo after completed action....
        }
      }
    }
  });
  showLoading(); //show loading page
}
// >>>>>>>>>>
// <><><><>>>> (show&hide spinner function) call of them in every function
// >>>>>>>>>>>>>
function showLoading() {
  loadingPage.classList.remove("d-none"); //show loading page
}
function hideLoading() {
  loadingPage.classList.add("d-none"); //hide loading page
}
// >>>>>>>>>>
//>>(progressBar function) call it in displayData function
// >>>>>>>>>>>>>
function progressBarFunc() {
  const tasksNumber = allTasks.length; //num of all tasks
  numOfTasks.innerHTML = tasksNumber; //html
  const CompletedTasks = allTasks.filter((task) => task.completed == true); //get array of completed tasks
  numOfCompletedTasks.innerHTML = CompletedTasks.length; //html
  const completeTasksNumber = CompletedTasks.length; // num of completed tasks
  let percentage = (completeTasksNumber / tasksNumber) * 100;
  if (isNaN(percentage)) {
    percentage = 0;
  }
  console.log(percentage);
  bar.style.width = `${percentage}%`;
}
