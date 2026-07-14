let appData = {
    "Groceries": [
        { text: "Milk", completed: false },
        { text: "Eggs", completed: true },
        { text: "Bread", completed: false }
    ],
    "Hardware": [
        { text: "Hammer", completed: false },
        { text: "Nails", completed: false }
    ]
};

// Controls view routing: "home" or name of selected list
let currentListName = "home";

// DOM Containers
const homePageContainer = document.getElementById('homePageContainer');
const shoppingListContainer = document.getElementById('shoppingListContainer');
const homepageGrid = document.getElementById('homepageGrid');
const shoppingListElement = document.getElementById('shoppingList');
const listTitleElement = document.getElementById('listTitleElement');

// Sidebars & Core Action Links
const leftSidebar = document.getElementById('leftSidebar');
const homeLink = document.getElementById('homeLink');
const addItemBtn = document.getElementById('addItemBtn');
const sortBtn = document.getElementById('sortBtn');
const newListBtn = document.getElementById('newListBtn');
const goHomeBtn = document.getElementById('goHomeBtn');
const deleteListBtn = document.getElementById('deleteListBtn');

// Primary Display Routing Function
function render() {
    if (currentListName === "home") {
        // Show Homepage, Hide Shopping View
        homePageContainer.style.display = "block";
        shoppingListContainer.style.display = "none";
        leftSidebar.style.visibility = "hidden";
        deleteListBtn.style.display = "none";
        
        renderHomepage();
    } else {
        // Hide Homepage, Show Active Shopping View
        homePageContainer.style.display = "none";
        shoppingListContainer.style.display = "block";
        leftSidebar.style.visibility = "visible";
        deleteListBtn.style.display = "block";

        renderActiveList();
    }
}

// 🏠 Draw the Homepage grid options
function renderHomepage() {
    homepageGrid.innerHTML = '';
    const lists = Object.keys(appData);

    lists.forEach(name => {
        const card = document.createElement('div');
        card.className = 'list-card';
        
        const count = appData[name].length;
        card.innerHTML = `
            <div>${name}</div>
            <div class="list-card-count">${count} item${count === 1 ? '' : 's'}</div>
        `;

        // Clicking a dashboard card takes you into that list
        card.addEventListener('click', () => {
            currentListName = name;
            render();
        });

        homepageGrid.appendChild(card);
    });
}

// 🛒 Draw the items inside the selected active list
function renderActiveList() {
    shoppingListElement.innerHTML = '';
    listTitleElement.textContent = currentListName;

    const items = appData[currentListName];
    if (!items) return;

    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'list-item';

        // 1. Checkbox element (Clicking toggles checkmark and cross out style)
        const checkBox = document.createElement('div');
        checkBox.className = 'status-square';
        if (item.completed) {
            checkBox.style.backgroundColor = '#2ecc71';
            checkBox.style.borderColor = '#2ecc71';
            checkBox.innerHTML = '✓';
        }

        checkBox.addEventListener('click', () => {
            item.completed = !item.completed;
            renderActiveList(); // Instant visual update
        });
        li.appendChild(checkBox);

        // 2. Colored text box block
        const textBox = document.createElement('div');
        textBox.className = 'item-text-box';
        textBox.textContent = item.text;
        if (item.completed) {
            textBox.classList.add('struck-through');
        }

        // Inline Title Edit: Click item text block to change it
        textBox.addEventListener('click', () => {
            const updatedText = prompt('Edit your item name:', item.text);
            if (updatedText !== null && updatedText.trim() !== '') {
                item.text = updatedText.trim();
                renderActiveList();
            }
        });
        li.appendChild(textBox);

        // 3. Delete single row item button (x)
        const deleteItemBtn = document.createElement('button');
        deleteItemBtn.className = 'delete-item-btn';
        deleteItemBtn.innerHTML = '×';
        deleteItemBtn.addEventListener('click', () => {
            appData[currentListName].splice(index, 1);
            renderActiveList();
        });
        li.appendChild(deleteItemBtn);

        shoppingListElement.appendChild(li);
    });
}

/* --- SYSTEM ASSIGNED EVENT LISTENERS --- */

// Edit current List Title by clicking the header directly
listTitleElement.addEventListener('click', () => {
    const newListName = prompt('Edit List Title:', currentListName);
    if (!newListName || newListName.trim() === '' || newListName.trim() === currentListName) return;
    
    const cleanName = newListName.trim();
    if (appData[cleanName]) {
        alert('A list with that name already exists!');
        return;
    }

    // Move old items to the new key name, delete old key
    appData[cleanName] = appData[currentListName];
    delete appData[currentListName];
    currentListName = cleanName;
    render();
});

// Left Panel: Add item entry to list
addItemBtn.addEventListener('click', () => {
    if (currentListName === "home") return;
    const name = prompt('Enter item name:');
    if (!name || name.trim() === '') return;

    appData[currentListName].push({ text: name.trim(), completed: false });
    renderActiveList();
});

// Left Panel: Alphabetical list sorting logic
sortBtn.addEventListener('click', () => {
    if (currentListName === "home") return;
    appData[currentListName].sort((a, b) => a.text.localeCompare(b.text));
    renderActiveList();
});

// Right Panel: Create a new list (Saves historical lists in appData memory map)
newListBtn.addEventListener('click', () => {
    const listName = prompt('Enter name for the new list:');
    if (!listName || listName.trim() === '') return;

    const cleanName = listName.trim();
    if (appData[cleanName]) {
        alert('A list with that name already exists!');
        return;
    }

    appData[cleanName] = [];
    currentListName = cleanName;
    render();
});

// Right Panel Navigation and Heading Clicks
goHomeBtn.addEventListener('click', () => {
    currentListName = "home";
    render();
});
homeLink.addEventListener('click', () => {
    currentListName = "home";
    render();
});

// Right Panel: Delete whole list layout view panel
deleteListBtn.addEventListener('click', () => {
    if (currentListName === "home") return;
    const confirmation = confirm(`Are you sure you want to delete the "${currentListName}" list entirely?`);
    if (!confirmation) return;

    delete appData[currentListName];
    currentListName = "home"; // Drop straight back onto homepage view
    render();
});

// Initialize application state view loop
render();
