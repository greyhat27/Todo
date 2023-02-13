//declaration of global variables
const input=document.querySelector("#input");
const listItem=document.querySelector("#list");
const del=document.querySelector("#delete");
const addButton=document.querySelector("#add-btn");
const taskCount=document.querySelector("#task-count");
const unComplete=document.querySelector("#uncomplete");
const all=document.querySelector("#all");
const complete=document.querySelector("#complete-task");
const modal=document.getElementById("modal");
const edi=document.querySelector("#edited");
const cancel=document.querySelector(".btn-cancel");
const ok=document.querySelector(".btn-ok")
let uniqueId;
let retrievedArray=[];

//created localStorage for tasks
if(localStorage.getItem('task') === null && localStorage.getItem('completed') === null && localStorage.getItem('incomplete') === null) {
    localStorage.setItem('task', JSON.stringify([]));
    localStorage.setItem('completed', JSON.stringify([]));
    localStorage.setItem('incomplete', JSON.stringify([]));
  }

cancel.onclick = function() {
  modal.style.display = "none";
}

//calling renderList functon to render list when we start 
renderList(JSON.parse(localStorage.getItem("task")));
if((JSON.parse(localStorage.getItem("task")))?.length===0){
    const li= document.createElement('li');
    li.innerHTML=`<div id="no-task">No tasks at the moment</div>`;
    listItem.append(li);
    renderList(JSON.parse(localStorage.getItem("task")))
}

//function to append new task into to the list
function addTolist(task){
    const li= document.createElement('li');
    li.innerHTML=
    `     <div>
    <input type="checkbox" name="" id="${task.id}" ${task.completed ? 'checked':''} class="check" >
    <label for="${task.id}">${task.text}</label>
    </div>
    <div id="edit-sec">
    <div id="edit" data-unique="${task.id}" data-text="${task.text}">Edit</div>
    <img src="./resources/trash.png" alt="" class="delete" data-id="${task.id}">
    </div>
    `
    listItem.append(li);
}

//function to add incomplete task list
function addTouncomplete(){
    retrievedArray=JSON.parse(localStorage.getItem('task'));
    const newTask=retrievedArray.filter((val)=>val.completed===false);
    retrievedArray=newTask;
    localStorage.setItem('incomplete', JSON.stringify(retrievedArray))
    renderList(retrievedArray);
}

//funtion to add tasks into completed task list
function addTocomplete(){
    retrievedArray=JSON.parse(localStorage.getItem('task'));
    const newTask=retrievedArray.filter((val)=>val.completed===true);
    retrievedArray=newTask;
    localStorage.setItem('completed', JSON.stringify(retrievedArray))
    renderList(retrievedArray);
}

//functon to add new task
function addTask(task1){
    retrievedArray=JSON.parse(localStorage.getItem("task"));
    retrievedArray.push(task1);
    localStorage.setItem("task", JSON.stringify(retrievedArray));
    renderList(JSON.parse(localStorage.getItem("task")));
};

//function to delete task (from all the three lists i.e. all, incomplete, complete)
function deleteTask(taskId){
    retrievedArray=JSON.parse(localStorage.getItem('task'));

    const newTask=retrievedArray.filter(function(val){
        return val.id !==taskId;
    });
    retrievedArray=newTask;
    
    localStorage.setItem('task', JSON.stringify(retrievedArray));

    retrievedArray=JSON.parse(localStorage.getItem('incomplete'));

    const newTask1=retrievedArray.filter((val)=>val.id !== taskId);
    retrievedArray=newTask1;
    localStorage.setItem('incomplete', JSON.stringify(retrievedArray));

    retrievedArray=JSON.parse(localStorage.getItem('completed'));
    if(typeof retrievedArray !== 'undefined' && retrievedArray !== null){
    const newTask2=retrievedArray.filter((val)=>val.id !== taskId);
    retrievedArray=newTask2;
    }
    renderList(JSON.parse(localStorage.getItem('task')));
}

//function to render the respective list of tasks
function renderList(task){
    listItem.innerHTML='';
    for(let i=0;i<task.length;i++){
        addTolist(task[i]);
    }
    taskCount.innerHTML=task.length;
    if(task.length===0){
        const li= document.createElement('li');
        li.innerHTML=`<div id="no-task">No tasks at the moment</div>`;
        listItem.append(li);
    }
};

//function to mark task as done and add to completed task list
function taskDone(taskId){
    retrievedArray=JSON.parse(localStorage.getItem('task'));
    const newTask=retrievedArray.filter(task => task.id ===  taskId);
    if(newTask.length>0){
        const task=newTask[0];
        task.completed = !task.completed;
        localStorage.setItem('task', JSON.stringify(retrievedArray))
        renderList(JSON.parse(localStorage.getItem('task')));///// line 128
        if(task.completed===true){
            retrievedArray=JSON.parse(localStorage.getItem('completed'));
            retrievedArray.push(task);
            localStorage.setItem('completed', JSON.stringify(retrievedArray));
        }
        else{
            retrievedArray=JSON.parse(localStorage.getItem('incomplete'));
            retrievedArray.push(task);
            localStorage.setItem('incomplete', JSON.stringify(retrievedArray));
        }
    }
};

//function to edit the particular task 
function editTask(id, msg){
    retrievedArray=JSON.parse(localStorage.getItem('task'));
    const newTask=retrievedArray.filter(val=>val.id===id)
    if(newTask.length>0){
        const task=newTask[0];
        task.text=msg;
        localStorage.setItem('task', JSON.stringify(retrievedArray))
        renderList(retrievedArray);
    }
}

//callback function to handle keyup events
function handelKeyup(e){
    const target=e.target;

    if(target.id=='input' && e.key==='Enter'){
        const text=e.target.value;
        if(!text){
            return;
        }
        const task={
            text,
            id: Date.now().toString(),
            completed: false
        }
        e.target.value='';
        addTask(task);
    }
    else if(target.id=='edited' && e.key==='Enter'){
        const text=target.value;
        editTask(uniqueId,text);
        modal.style.display="none";
    }
}

//callback function to handle click events
function clickEvent(e){
    const target= e.target;
    if(target.className=='delete'){
        const taskId=target.dataset.id;
        deleteTask(taskId);
        return;
    }
    else if(target.className=='add-btn'){
        const text=input.value;
        if(!text){
            alert("Please add task");
            return;
        }
        const task={
            text,
            id: Date.now().toString(),
            completed: false
        }
        input.value='';
        addTask(task);
        return;
    }
    else if(target.className=='check'){
        const taskId = target.id;
        taskDone(taskId);
        return;
    }
    else if(target.id=='complete-task'){
        addTocomplete();
        complete.style.color="red";
        unComplete.style.color="black";
        all.style.color="black";
    }
    else if(target.id=='uncomplete'){
        addTouncomplete();
        unComplete.style.color="red";
        complete.style.color="black";
        all.style.color="black";
    }
    else if(target.id=='all'){
        renderList(JSON.parse(localStorage.getItem("task")));
        complete.style.color="black";
        all.style.color="red";
        unComplete.style.color="black";
    }
    else if(target.id=='edit'){
        const text=target.dataset.text;
        uniqueId=target.dataset.unique;
        edi.value=text;
        modal.style.display="block";
    }
    else if(target.id=='okie'){
        const msg=edi.value;
        editTask(uniqueId,msg);
        modal.style.display="none";
    }
}

//even listeners
edi.addEventListener('keyup',handelKeyup)
input.addEventListener('keyup', handelKeyup);
document.addEventListener('click', clickEvent);