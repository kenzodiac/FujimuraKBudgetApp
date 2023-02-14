//importing functions from localStorage.js to enable favorites functionality
import { SaveItemToLocalStorage, GetLocalStorage, RemoveFromLocalStorage, ClearLocalStorage } from "./localStorage.js";

//DECLARE VARIABLES FOR LINKING HTML TO JAVASCRIPT
    //Field for showing the total budget at the top of the page
    let startingBudgetShow = document.getElementById("startingBudgetShow");

    //the deposit input field and its corresponding submit button
    let depositField = document.getElementById("depositField");
    let depositBtn = document.getElementById("depositBtn");

    //the expense input fields and its corresponding button
    let expenseNameField = document.getElementById("expenseNameField");
    let expenseNumberField = document.getElementById("expenseNumberField");

    let expenseBtn = document.getElementById("expenseBtn");

    //the total expenses and remaining budget output areas
    let totExpense = document.getElementById("totExpense");
    let remainder = document.getElementById("remainder");

    //area for injecting itemized budget breakdown in ledger form
    let ledgerInjectionArea = document.getElementById("ledgerInjectionArea");

    //reset button for deleting local storage and resetting the page
    let resetBtn = document.getElementById("resetBtn");

//counter for tracking initial deposit
let counter = 1;

//variables for tracking budget:
let initialBudget = 0;
let totalExpenses = 0;
let remainingBudget = 0;

//SYSTEM FOR CREATING TASK ID#s
function IdGenerator(){
    let data = GetLocalStorage();
    let tempId;
    if (data.length == 0){
        tempId = 1;
    } else {
        tempId = data[data.length - 1].id + 1;
    }
    return tempId
}

//FUNCTIONS FOR CALCULATING BUDGET AND POPULATING THE PAGE WITH BUDGET INFO
function PopulateBudget(){
    let data = GetLocalStorage();
    console.log(data);
    if (data === undefined){
        initialBudget = 0;
    } else {
        initialBudget = 0;
        for (let i = 0; i < data.length; i++){
            if (data[i].type === 'deposit'){
                initialBudget += data[i].amount;
            }
        }
    }
    startingBudgetShow.textContent = "$"+initialBudget;
};

function PopulateTotalExpenses(){
    let data = GetLocalStorage();
    if (data === undefined){
        totalExpenses = 0;
    } else {
        totalExpenses = 0;
        for (let i = 0; i < data.length; i++){
            if (data[i].type === 'expense'){
                totalExpenses += data[i].amount;
            }
        }
    }
    totExpense.textContent = totalExpenses;
};

function PopulateRemainingBudget(){
    remainingBudget = (initialBudget - totalExpenses);
    remainder.textContent = remainingBudget;
};

function PopulatePage(){
    PopulateBudget();
    PopulateTotalExpenses();
    PopulateRemainingBudget();
};

//EVENT LISTENER FOR PAGE BUTTONS
//deposit button for adding funds
depositBtn.addEventListener('click', function(){
    //determining initial deposit for record keeping purposes
    let type;
    if (counter == 1){
        type = 'initial deposit';
    } else {
        type = 'subsequent deposit';
    }

    //modeling object for storage of data into local storage
    let item = { 
        name: type,
        amount: parseInt(depositField.value),
        type: 'deposit',
        id: IdGenerator()
    };

    //conditional to make sure there is an actual input; else statement handles main behavior
    if (depositField.value === ''){
        alert('Error: field must be filled out.');
    } else {
        SaveItemToLocalStorage(item);
        PopulatePage();
        counter++;
        depositField.value = '';
    }
});

//expense button for adding expenses
expenseBtn.addEventListener('click', function(){
    //modeling object for storage of data into local storage
    let item = { 
        name: expenseNameField.value, 
        amount: parseInt(expenseNumberField.value), 
        type: 'expense',
        id: IdGenerator()
    };

    //conditional to make sure there is an actual input; else statement handles main behavior
    if (expenseNameField.value === '' || expenseNumberField.value === ''){
        alert('Error: ALL fields must be filled out.');
    } else {
        SaveItemToLocalStorage(item);
        PopulatePage();
        expenseNameField.value = '';
        expenseNumberField.value = '';
    }
});

//reset button for clearing local storage and resetting the page
resetBtn.addEventListener('click', function(){
    counter = 1;
    ClearLocalStorage();
    PopulatePage();
});

PopulatePage();