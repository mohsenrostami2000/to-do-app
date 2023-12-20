// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// edit option
let editElement;
let editFlag = false;
let editId = "";

// ****** EVENT LISTENERS **********
form.addEventListener("submit", addItem);

clearBtn.addEventListener("click", clearItems);
// load items
window.addEventListener('DOMContentLoaded', setupItesm);

// ****** FUNCTIONS **********
function addItem (e) {
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();
    // if (value !== "" && editFlag === false){
    //     console.log("add item to the list");
    // } else if (value !== "" && editFlag === true){
    //     console.log("editing");
    // } else {
    //     console.log("empty value");
    // }
    if (value && !editFlag){
       createListItem(id, value);
        // display alert
        displayAlert('item added to the list', 'success');
        // show container
        container.classList.add('show-container');
        // add to local storage
        addToLocalStorage(id, value);
        // set back to default
        setBackToDefault();
    } else if (value && editFlag){
        editElement.innerHTML = value;
        displayAlert('Item edited', 'success');
        // editLocalStorage
        editLocalStorage(editId, value);
        setBackToDefault();
    } else {
        displayAlert("please enter value", "danger");
    }
}
// display alert
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    // remove alert
    setTimeout(() => {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`)
    }, 1000);
};
//clear items
function clearItems () {
    const items = document.querySelectorAll('.grocery-item');
    if(items.length > 0){
        items.forEach(function(item) {
            list.removeChild(item);
        });
    }
    container.classList.remove('show-container');
    displayAlert("empty list", "danger");
    setBackToDefault();
    localStorage.removeItem('list');
};
// delete button function
function deleteItem(e){
    console.log("delete button clicked!");
    // const delItem = document.querySelector('.grocery-item');
    // delItem.remove();
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length === 0){
        container.classList.remove('show-container');
    }
    displayAlert('item removed', 'danger');
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
}

// edit button function 
function editItem(e){
    // console.log('edit button clicked');
    const element = e.currentTarget.parentElement.parentElement;
    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editId = element.dataset.id;
    submitBtn.textContent = 'edit';

}
// set back to default
function setBackToDefault(){
    grocery.value = "";
    editFlag = false;
    editId = "";
    submitBtn.textContent = "submit"
};
// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
    // const grocery = {id:id, value:value} =====>>>> this is for ES5, in ES6 if value and key is the same, we use it like below
    const grocery = {id, value};
    let items = getLocalStorage();
    console.log(items)
    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items));
};
function removeFromLocalStorage(id){
    let items = getLocalStorage();
    items = items.filter((item)=>{
        if (item.id !== id) {
            return item
        };
    });
    localStorage.setItem("list", JSON.stringify(items));
};
function editLocalStorage(id, value){
    let items = getLocalStorage();
    items = items.map((item)=>{
        if(item.id === id) {
            item.value = value;
        };
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items));

};
function getLocalStorage(){
    return localStorage.getItem("list")? JSON.parse(localStorage.getItem('list')): [];
};
// localStorage API
// setItem
// removeItem
// save as strings 
// localStorage.setItem("orange", JSON.stringify(["item", "item2"]));
// const oranges = JSON.parse(localStorage.getItem("orange"));
// console.log(oranges);
// localStorage.removeItem("orange");

// ****** SETUP ITEMS **********
function setupItesm(){
    let items = getLocalStorage();
    if(items.length > 0){
        items.forEach((item)=>{
            createListItem(item.id, item.value);
        });
        container.classList.add('show-container');
    };
};

function createListItem(id, value){
    const element = document.createElement('article');
    // add class
    element.classList.add('grocery-item');
    // add id
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
      <button class="edit-btn" type="button">
        <i class="fas fa-edit"></i>
      </button>
      <button class="delete-btn" type="button">
        <i class="fas fa-trash"></i>
      </button>
    </div>`;
    // select delete and edit function
    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    // add event to delete and edit function
    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);
    // append child
    list.appendChild(element);
};