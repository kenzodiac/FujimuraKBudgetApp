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
    if (remainingBudget < 0){
        remainder.style = 'color: red;';
    } else {
        remainder.style = 'color: black;';
    }
};

function PopulatePage(){
    PopulateBudget();
    PopulateTotalExpenses();
    PopulateRemainingBudget();
    CreateElements();
};

//FUNCTION FOR DISPLAYING TABULATED BUDGET INFORMATION
function CreateElements(){
    let items = GetLocalStorage();
    let lineCounter = 1;
    let runningTot = 0;
    ledgerInjectionArea.innerHTML = '';

    //create table
    let table = document.createElement('table');
    table.style = 'margin-right: auto; margin-left: auto;';
    
    //create first row of table titles
    let tableTitlesRow = document.createElement('tr');
    tableTitlesRow.style = 'background-color: rgba(0,0,40,.5); color: white;'
    let idTitle = document.createElement('th');
    idTitle.textContent = 'ID:';
    idTitle.style="padding-right: .5rem; padding-left: .5rem;"
    let descTitle = document.createElement('th');
    descTitle.textContent = 'Description:';
    descTitle.style="padding-right: .5rem; padding-left: .5rem;"
    let amountTitle = document.createElement('th');
    amountTitle.textContent = 'Amount:';
    amountTitle.style="padding-right: .5rem; padding-left: .5rem;"
    let totalTitle = document.createElement('th');
    totalTitle.textContent = 'Total:';
    totalTitle.style="padding-right: .5rem; padding-left: .5rem;"
    let deleteTitle = document.createElement('th');
    deleteTitle.textContent = 'Delete:'
    deleteTitle.style="padding-right: .5rem; padding-left: .5rem;"

    //append components into main component
    tableTitlesRow.appendChild(idTitle);
    tableTitlesRow.appendChild(descTitle);
    tableTitlesRow.appendChild(amountTitle);
    tableTitlesRow.appendChild(totalTitle);
    tableTitlesRow.appendChild(deleteTitle);
    table.appendChild(tableTitlesRow);

    //.map to create table components
    items.map(item => {
        //creating table rows for inserting into ledger table
            //table cell for displaying item id
            let idTd = document.createElement('td');
            idTd.textContent = item.id;
            idTd.style = 'color: white;';

            //table cell for displaying description
            let descTd = document.createElement('td');
            descTd.textContent = item.name;
            descTd.style = 'color: white;';

            //table cell for displaying item dollar amount
            let amountTd = document.createElement('td');
            if (item.type === 'expense'){
                amountTd.textContent = '-$' + item.amount;
                amountTd.style = 'color: yellow;';
            } else {
                amountTd.textContent = '+$' + item.amount;
                amountTd.style = 'color: greenyellow;';
            }

            //table cell for displaying running total
            let totTd = document.createElement('td');
            if (item.type === 'expense'){
                runningTot -= item.amount;
            } else {
                runningTot += item.amount;
            }
            totTd.textContent = '$' + runningTot;
            if (runningTot >= 0){
                totTd.style = 'color: white;';
            } else {
                totTd.style = 'color: red';
            }

            //table cell for displaying delete item button
            let deleteTd = document.createElement('td');
            let deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'btn btn-danger deleteBtnStyle';
            deleteBtn.textContent = 'X';
            deleteBtn.addEventListener('click', function(){
                RemoveFromLocalStorage(item);
                // WipeStaging();
                CreateElements();
            });
            deleteTd.appendChild(deleteBtn);

            //table row for combining all of the cells
            let rowTd = document.createElement('tr');
            if (lineCounter % 2 === 1) {
                rowTd.style = 'background-color: rgba(0,0,0,.4);'
            } else {
                rowTd.style = 'background-color: rgba(0,0,0,.6);'
            }
            lineCounter++;
        //appending components into table
        rowTd.appendChild(idTd);
        rowTd.appendChild(descTd);
        rowTd.appendChild(amountTd);
        rowTd.appendChild(totTd);
        rowTd.appendChild(deleteTd);
        table.appendChild(rowTd);
    });
    //inject table into page, but only if there is information for it
    if (items.length != 0) {
        ledgerInjectionArea.appendChild(table);
    }
}

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