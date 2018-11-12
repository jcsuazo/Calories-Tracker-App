
    //Calories App Storage Controller
    const CaloriesStorageController = (function () {
        
        return {
            saveDataLocalStorage: function (Newitem) {
                let items;
                if (localStorage.getItem('items') === null) {
                    items = [];
                } else {
                    items = JSON.parse(localStorage.getItem('items'));
                }
                items.push(Newitem);
                localStorage.setItem('items', JSON.stringify(items));
            },
            getDataFromLocalStorage: function () {
                let items;
                if (localStorage.getItem('items') === null) {
                    items = [];
                } else {
                    items = JSON.parse(localStorage.getItem('items'));
                }
                return items;
            },
        }
    })();

    //Calories App Item Controller
    const CaloriesItemController = (function () {
        const Item = function (id, name, calories) {
            this.id = id;
            this.name = name;
            this.calories = calories;
        };
        const data = {
            items: CaloriesStorageController.getDataFromLocalStorage(),
            totalCalories: 0,
            currentItem: null
        }

        return {
            setItemData: function (name, calories) {
                let id;
                if (data.items.length > 0) {
                    id = data.items[data.items.length - 1].id + 1;
                } else {
                    id = 0;
                }
                //Set Calories to Numbers
                calories = parseInt(calories);
                Newitem = new Item(id, name, calories);
                data.items.push(Newitem);
                return Newitem;
            },
            logData: function () {return data},
            sendData: function () {return data.items},
            setTotalCalories: function (itemsArr) {
                let count = 0;
                itemsArr.forEach(item => {
                    count += item.calories
                });
                data.totalCalories = count;
            },
            setCurrentItem: function (item) {
                data.currentItem = item;
            },
        }
    })();

    //Calories App UI Controller
    const CaloriesUIController = (function () {
        const allSeclector = {
            addBtn: document.querySelector('.add-btn'),
            updateBtn: document.querySelector('.update-btn'),
            deleteBtn: document.querySelector('.delete-btn'),
            backBtn: document.querySelector('.back-btn'),
            nameInput: document.querySelector('#item-name'),
            caloriesInput: document.querySelector('#item-calories'),
            itemUl: document.querySelector('#item-list'),
            totalCalories: document.querySelector('.total-calories'),
            clearBtn: document.querySelector('.clear-btn')
        }

        return {
            loadAllItems: function () {
                //Get items from local stroge
                const items = CaloriesStorageController.getDataFromLocalStorage();
                if (items.length !== 0) {
                    //Show ul
                    CaloriesUIController.showHide('block');
                    //Display all items
                    html = '';
                    items.forEach(item => {
                        html += `
                            <li class="collection-item" id="item-${item.id}">
                                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                                <a href="#" class="secondary-content">
                                    <i class="edit-item fa fa-pencil"></i>
                                </a>
                            </li>
                        `;
                    });
                    allSeclector.itemUl.innerHTML = html;
                    
                }
            },
            getAllSeclector: function () {return allSeclector},
            displayItems: function (Newitem) {
                //Creage li
                const li = document.createElement('li');
                //Adding classes to li
                li.className = 'collection-item';
                //Adding id
                li.id = `item-${Newitem.id}`;
                //Creating li text
                li.innerHTML = `
                    <strong>${Newitem.name}: </strong> <em>${Newitem.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                `;
                allSeclector.itemUl.appendChild(li);
            },
            clearInput: function () {
                allSeclector.nameInput.value = '',
                allSeclector.caloriesInput.value = ''
            },
            displayTotalCalories: function () {
                const data = CaloriesItemController.logData();
                allSeclector.totalCalories.innerHTML = data.totalCalories;
            },
            showHide: function (itemUlDisplay = 'none', updateBtnDisplay = 'none', deleteBtnDisplay = 'none', backBtnDisplay = 'none', addBtnDisplay = 'block') {
                allSeclector.itemUl.style.display = itemUlDisplay
                allSeclector.updateBtn.style.display = updateBtnDisplay
                allSeclector.deleteBtn.style.display = deleteBtnDisplay
                allSeclector.backBtn.style.display = backBtnDisplay
                allSeclector.addBtn.style.display = addBtnDisplay
            },
        }
    })();

    //Calories App Event Controller
    const CaloriesEventController = (function (){
        //Getting All Selectors
        const allSeclector = CaloriesUIController.getAllSeclector();
        //Getting All Data
        const data = CaloriesItemController.logData();
        //Getting all Items form Data
        const items = CaloriesItemController.sendData();
        
        return {
            addItem: function (e) {
                e.preventDefault();
                if (allSeclector.nameInput.value !== '' && allSeclector.caloriesInput.value !== '') {
                    //Show ul
                    CaloriesUIController.showHide('block');
                    //Create data and store it on data array
                    const Newitem = CaloriesItemController.setItemData(allSeclector.nameInput.value, allSeclector.caloriesInput.value);
                    //Store Data On Local Storage
                    CaloriesStorageController.saveDataLocalStorage(Newitem);
                    //Display the Data on local Storage
                    CaloriesUIController.displayItems(Newitem);
                    //Clearing the input
                    CaloriesUIController.clearInput();
                    //Setting total calories on Data
                    CaloriesItemController.setTotalCalories(items);
                    //Display Total Calories in UI
                    CaloriesUIController.displayTotalCalories();
                }
            },
            enterEditState: function (e) {
                e.preventDefault();
                if (e.target.classList.contains('edit-item')) {
                    //Show the Edit State
                    CaloriesUIController.showHide('block', 'inline', 'inline', 'inline', 'none');
                    //Get li id
                    let idArr = e.target.parentElement.parentElement.id;
                    idArr = idArr.split('-');
                    //Getting input values
                    items.forEach(item => {
                        if (item.id === parseInt(idArr[1])) {
                            CaloriesItemController.setCurrentItem(item);
                        }
                    });
                    allSeclector.nameInput.value = data.currentItem.name;
                    allSeclector.caloriesInput.value = data.currentItem.calories;

                }
            },
            updateItem: function (e) {
                e.preventDefault();
                const items = CaloriesStorageController.getDataFromLocalStorage();
                items.forEach(item => {
                        if (item.id === data.currentItem.id) {
                            item.name = allSeclector.nameInput.value;
                            item.calories = parseInt(allSeclector.caloriesInput.value);
                        }
                });
                localStorage.setItem('items', JSON.stringify(items));
                data.item = items;
                CaloriesUIController.loadAllItems()
                //Setting total calories on Data
                CaloriesItemController.setTotalCalories(items);
                //Display Total Calories in UI When App Start
                CaloriesUIController.displayTotalCalories();
            },
            deleteItem: function (e) {
                e.preventDefault();
                
                let items = CaloriesStorageController.getDataFromLocalStorage();
                items.forEach((item, index) => {
                    if (item.id === data.currentItem.id) {
                        items.splice(index, 1);
                    }
                    localStorage.setItem('items', JSON.stringify(items));
                    window.location.reload();
                });
            },
            clearAllItems: function (e) {
                e.preventDefault();
                localStorage.removeItem('items');
                window.location.reload();
            },
            backToApp: function (e) {
                e.preventDefault();
                //Hide the Edit State
                CaloriesUIController.showHide('block', 'none', 'none', 'none', 'inline');
                //Clear Values
                allSeclector.nameInput.value = '';
                allSeclector.caloriesInput.value = '';
            },
        }
    })();

    //Calories App Main Controller
    const CaloriesMainController = (function (CaloriesStorageController, CaloriesItemController, CaloriesUIController, CaloriesUIController) {
        //Get all Selector
        const allSeclector = CaloriesUIController.getAllSeclector();
        //All Event Function
        function allEventFunction() {
            //Add a item event
            allSeclector.addBtn.addEventListener('click', CaloriesEventController.addItem);
            //Enter Edit State event
            allSeclector.itemUl.addEventListener('click', CaloriesEventController.enterEditState);
            //Update Meal Event
            allSeclector.updateBtn.addEventListener('click', CaloriesEventController.updateItem);
            //delete Meal Event
            allSeclector.deleteBtn.addEventListener('click', CaloriesEventController.deleteItem);
            //clear all Meal Event
            allSeclector.clearBtn.addEventListener('click', CaloriesEventController.clearAllItems);
            //Back to App
            allSeclector.backBtn.addEventListener('click', CaloriesEventController.backToApp);
        };

        return {
            //Start Application Funciton
            init: function () {

                //Load All Items Went App Stats
                CaloriesUIController.loadAllItems();
                //Getting all Items form Data
                const items = CaloriesItemController.sendData();
                //Setting total calories on Data
                CaloriesItemController.setTotalCalories(items);
                //Display Total Calories in UI When App Start
                CaloriesUIController.displayTotalCalories();

                //Calling my All Event Function
                allEventFunction();

            },
        }
    })(CaloriesStorageController, CaloriesItemController, CaloriesUIController, CaloriesUIController);
    CaloriesMainController.init();
