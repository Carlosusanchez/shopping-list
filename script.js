let appData = {
    "Grocery Shopping": [
        { text: "Fresh Whole Milk", completed: false },
        { text: "Organic Eggs", completed: true },
        { text: "Sourdough Bread", completed: false }
    ],
    "Weekend Hardware": [
        { text: "Steel Hammer", completed: false },
        { text: "Galvanized Nails", completed: false }
    ]
};

// Application view state: defaults directly to the dashboard
let currentView = "home";

// DOM Hook Registry
const mainDisplayBox = document.getElementById('mainDisplayBox');
const leftSidebar = document.getElementById('leftSidebar');
const addItemBtn = document.getElementById('addItemBtn');
const sortBtn = document.getElementById('sortBtn');
const homeLink = document.getElementById('homeLink');

// Navigation Button Hooks
const newListBtn = document.getElementById('newListBtn');
const dashboardBtn = document.getElementById('dashboardBtn');
const deleteListBtn = document.getElementById('deleteListBtn');

// Primary Interface Layout Switcher Engine
function updateAppView() {
    if (currentView === "home") {
        leftSidebar.style.visibility = "hidden";
        deleteListBtn.style.display = "none";
        renderHomepageDashboard();
    } else {
        leftSidebar.style.visibility = "visible";
        deleteListBtn.style.display = "block";
        renderActiveShoppingList();
    }
}

// 🏠 SCREEN ONE: Simple Cohesive Homepage Dashboard Layout
function renderHomepageDashboard() {
    mainDisplayBox.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'homepage-container';

    const title = document.createElement('h2');
    title.className = 'list-title';
    title.textContent = "Your Shopping Lists";
    container.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'dashboard-grid';

    const listKeys = Object.keys(appData);

    if (listKeys.length === 0) {
        const noLists = document.createElement('div');
        noLists.className = 'no-lists-message';
        noLists.textContent = "No lists found. Click 'New List' on the right panel to get started!";
        grid.appendChild(noLists);
    } else {
        listKeys.forEach(listName => {
            const card = document.createElement('div');
            card.className = 'list-card';
            
            const count = appData[listName].length;
            card.innerHTML = `
                <div class="list-card-title">${listName}</div>
                <div class="list-card-count">${count} item${count === 1 ? '' : 's'}</div>
            `;

            card.addEventListener('click', () => {
                currentView = listName;
                updateAppView();
            });

            grid.appendChild(card);
        });
    }

    container.appendChild(grid);
    mainDisplayBox.appendChild(container);
}

// 🛒 SCREEN TWO: Active List Rendering Environment
function renderActiveShoppingList() {
    mainDisplayBox.innerHTML = '';

    // Render list header title correctly
    const listTitle = document.createElement('h2');
    listTitle.className = 'list-title';
    listTitle.textContent = currentView;
    mainDisplayBox.appendChild(listTitle);

    const ul = document.createElement('ul');
    ul.className = 'shopping-list';

    const items = appData[currentView];

    // Build the list element wrapper
    if (!items || items.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.style.color = '#777';
        emptyMsg.style.fontStyle = 'italic';
        emptyMsg.style.marginTop = '40px';
        emptyMsg.textContent = "This list has no items yet. Click 'Add Item' to start!";
        mainDisplayBox.appendChild(emptyMsg);
    } else {
        items.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'list-item';

            // 1. Interactive Checkbox Built-In
            const checkBox = document.createElement('div');
            checkBox.className = 'status-square';
            if (item.completed) {
                checkBox.style.backgroundColor = '#2ecc71';
                checkBox.style.borderColor = '#2ecc71';
                checkBox.innerHTML = '✓';
            }
            checkBox.addEventListener('click', (e) => {
                e.stopPropagation();
                item.completed = !item.completed;
                updateAppView();
            });
            li.appendChild(checkBox);

            // 2. Click-to-Edit Text Input Block
            const textBox = document.createElement('div');
            textBox.className = 'item-text-box';
            textBox.textContent = item.text;
            if (item.completed) {
                textBox.classList.add('struck-through');
            }
            textBox.addEventListener('click', () => {
                const newName = prompt("Rename your entry text:", item.text);
                if (newName !== null && newName.trim() !== "") {
                    item.text = newName.trim();
                    updateAppView();
                }
            });
            li.appendChild(textBox);

            // 3. Absolute Single Row Deletion Anchor
            const deleteItemBtn = document.createElement('button');
            deleteItemBtn.className = 'delete-item-btn';
            deleteItemBtn.innerHTML = '×';
            deleteItemBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                appData[currentView].splice(index, 1);
                updateAppView();
            });
            li.appendChild(deleteItemBtn);

            ul.appendChild(li);
        });
        
        mainDisplayBox.appendChild(ul);
    }
}

/* --- EVENT LIFECYCLE LISTENERS --- */

// Left Panel Actions
addItemBtn.addEventListener('click', () => {
    if (currentView === "home") return;
    const itemText = prompt("Enter the name of your new item:");
    if (!itemText || itemText.trim() === "") return;

    appData[currentView].push({ text: itemText.trim(), completed: false });
    updateAppView();
});

sortBtn.addEventListener('click', () => {
    if (currentView === "home") return;

    const method = prompt(
        "Choose sorting approach strategy option number:\n" +
        "1: Sort Alphabetically (A to Z)\n" +
        "2: Sort by Checked Off status (Open items to top)\n" +
        "3: Combine both (Open Alphabetical first, then Checked Alphabetical)"
    );

    const listRef = appData[currentView];

    if (method === '1') {
        listRef.sort((a, b) => a.text.localeCompare(b.text));
    } else if (method === '2') {
        listRef.sort((a, b) => a.completed - b.completed);
    } else if (method === '3') {
        listRef.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed - b.completed;
            return a.text.localeCompare(b.text);
        });
    } else if (method !== null) {
        alert("Invalid sorting selection choice entry.");
        return;
    }
    updateAppView();
});

// Right Panel Actions
newListBtn.addEventListener('click', () => {
    const listTitle = prompt("Enter a unique title heading for your new list:");
    if (!listTitle || listTitle.trim() === "") return;

    const refinedTitle = listTitle.trim();
    if (appData[refinedTitle]) {
        alert("A list under that specified title properties already exists!");
        return;
    }

    appData[refinedTitle] = [];
    currentView = refinedTitle;
    updateAppView();
});

dashboardBtn.addEventListener('click', () => {
    currentView = "home";
    updateAppView();
});

homeLink.addEventListener('click', () => {
    currentView = "home";
    updateAppView();
});

deleteListBtn.addEventListener('click', () => {
    if (currentView === "home") return;
    const check = confirm(`Are you completely sure you want to permanently delete "${currentView}"?`);
    if (!check) return;

    delete appData[currentView];
    currentView = "home";
    updateAppView();
});

// Start the runtime lifecycle sequence
updateAppView();
