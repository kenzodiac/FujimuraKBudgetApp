function SaveItemToLocalStorage(item){
    let budgetItem = GetLocalStorage();
    console.log(budgetItem);

    budgetItem.push(item);

    localStorage.setItem('BudgetItems', JSON.stringify(budgetItem));
    console.log('SaveItemToLocalStorage() has been executed');
}

function GetLocalStorage(){
    let localStorageData = localStorage.getItem('BudgetItems');

    if(localStorageData === null){
        return [];
    }
    return JSON.parse(localStorageData);
}

function ClearLocalStorage(){
    localStorage.clear();
    console.log(localStorage);
}

function RemoveFromLocalStorage(item){
    let budgetItem = GetLocalStorage();

    for (let i = 0; i < budgetItem.length; i++){
        if (budgetItem[i].id == item.id){
            budgetItem.splice(i, 1);
        }
    }

    localStorage.setItem('BudgetItems', JSON.stringify(budgetItem));
}

export { SaveItemToLocalStorage, GetLocalStorage, RemoveFromLocalStorage, ClearLocalStorage };