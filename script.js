const mainDisplayBox = document.getElementById('mainDisplayBox');
const addItemBtn = document.getElementById('addItemBtn');
const sortBtn = document.getElementById('sortBtn');

// System Dashboard Control Selectors
const homeLink = document.getElementById('homeLink');
const newListBtn = document.getElementById('newListBtn');
const changeListBtn = document.getElementById('changeListBtn');
const deleteListBtn = document.getElementById('deleteListBtn');

// System Core State
let currentView = 'dashboard'; 
let activeListIndex = 0;
let searchQuery = ""; // Tracks what the user is typing to filter elements

// Central Data Layer with localStorage fallback
let userLists = [];

// Triple-checked validation block to safely load data without crashing if storage is corrupt
try {
    const savedData = localStorage.getItem('shoppingTrackerData');
    if (savedData) {
        userLists = JSON.parse(savedData);
    } else {
        // Default starter data if completely fresh load
        userLists = [
            {
                name: "Weekly Groceries",
                items: [
                    { text: "Milk", completed: false },
                    { text: "Eggs", completed: true },
                    { text: "Bread", completed: false }
                ]
            },
            {
                name: "Hardware Store",
                items: [
                    { text: "Drywall Screws", completed: false },
                    { text: "Paint Brush", completed: false }
                ]
            }
        ];
    }
} catch (e) {
    console.error("Storage read failed, resetting to empty system.", e);
    userLists = [];
}

// Uncomplicated helper function to save current state safely
function saveToStorage() {
    try {
        localStorage.setItem('shoppingTrackerData', JSON.stringify(userLists));
    } catch (e) {
        console.error("Failed to write to local storage.", e);
    }
}

// Helper function to build a single list item line matching your CSS layout perfectly
function createListItemElement(item, itemIndex, listItemsArray) {
    const li = document.createElement('li');
    li.className = 'list-item';

    // 1. Interactive Checkbox Square (.status-square)
    const checkBox = document.createElement('div');
    checkBox.className = 'status-square';
    
    if (item.completed) {
        checkBox.innerHTML = '✓';
        checkBox.style.backgroundColor = '#2ecc71'; 
        checkBox.style.borderColor = '#2ecc71';
    }

    checkBox.addEventListener('click', (e) => {
        e.stopPropagation();
        item.completed = !item.completed;
        saveToStorage();
        renderApp();
    });
    li.appendChild(checkBox);

    // 2. Main Title Canvas Block (.item-text-box)
    const textBox = document.createElement('div');
    textBox.className = 'item-text-box';
    textBox.textContent = item.text;

    if (item.completed) {
        textBox.classList.add('struck-through');
    }

    textBox.addEventListener('click', () => {
        const updatedText = prompt('Rename your item:', item.text);
        if (updatedText !== null && updatedText.trim() !== '') {
            item.text = updatedText.trim();
            saveToStorage();
            renderApp();
        }
    });
    li.appendChild(textBox);

    // 3. Destructive Action Pin Button (.delete-item-btn)
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-item-btn';
    deleteBtn.innerHTML = '×'; 
    deleteBtn.title = "Delete Item";
    
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        listItemsArray.splice(itemIndex, 1);
        saveToStorage();
        renderApp();
    });
    li.appendChild(deleteBtn);

    return li;
}

// Shared helper function to inject an uncomplicated, clean search bar matching layout specs
function injectSearchBar(placeholderText) {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = placeholderText;
    searchInput.value = searchQuery;
    
    // Minimalistic style fallback so it fits cleanly in your display boxes
    searchInput.style.width = '100%';
    searchInput.style.padding = '10px';
    searchInput.style.marginBottom = '20px';
    searchInput.style.border = '1px solid #ccc';
    searchInput.style.borderRadius = '20px';
    searchInput.style.boxSizing = 'border-box';
    searchInput.style.fontSize = '1rem';

    // Listens to user keystrokes, updates the search query, and updates the display immediately
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        
        // Target structural elements directly to prevent complete screen redraw flashes while typing
        if (currentView === 'dashboard') {
            filterDashboardCards();
        } else {
            filterListRows();
        }
    });

    mainDisplayBox.appendChild(searchInput);
}

// Live-filters dashboard container structures based on search keys without resetting focused inputs
function filterDashboardCards() {
    const grid = mainDisplayBox.querySelector('.dashboard-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const cleanQuery = searchQuery.toLowerCase().trim();
    let visibleCardsCount = 0;

    userLists.forEach((list, idx) => {
        if (cleanQuery && !list.name.toLowerCase().includes(cleanQuery)) return;
        visibleCardsCount++;

        const card = document.createElement('div');
        card.className = 'dashboard-card';
        const incompleteCount = list.items.filter(i => !i.completed).length;
        card.innerHTML = `${list.name}<br><span style="font-size: 0.8rem; font-weight: normal; opacity: 0.7;">(${incompleteCount} items left)</span>`;

        card.addEventListener('click', () => {
            activeListIndex = idx;
            currentView = 'list';
            searchQuery = ""; // Auto-clear search query when jumping scopes
            renderApp();
        });
        grid.appendChild(card);
    });

    // Handle structural warnings if search results return zero boards
    let emptyWarning = mainDisplayBox.querySelector('.dashboard-empty-text');
    if (visibleCardsCount === 0) {
        if (!emptyWarning) {
            emptyWarning = document.createElement('p');
            emptyWarning.className = 'dashboard-empty-text';
            mainDisplayBox.appendChild(emptyWarning);
        }
        emptyWarning.textContent = 'No matching boards found.';
    } else if (emptyWarning) {
        emptyWarning.remove();
    }
}

// Live-filters individual row rows based on search keys without resetting focused inputs
function filterListRows() {
    const ul = mainDisplayBox.querySelector('.shopping-list');
    if (!ul) return;
    ul.innerHTML = '';

    const targetList = userLists[activeListIndex];
    const cleanQuery = searchQuery.toLowerCase().trim();

    targetList.items.forEach((item, index) => {
        if (cleanQuery && !item.text.toLowerCase().includes(cleanQuery)) return;
        const liElement = createListItemElement(item, index, targetList.items);
        ul.appendChild(liElement);
    });
}

// Master Rendering Hub orchestrating structural views based on layout state variables
function renderApp() {
    mainDisplayBox.innerHTML = '';

    if (currentView === 'dashboard') {
        // --- Render Dashboard Canvas View ---
        const heading = document.createElement('h2');
        heading.className = 'list-title';
        heading.textContent = 'Your Shopping Boards';
        mainDisplayBox.appendChild(heading);

        // Inject Search Bar targeting list collections
        injectSearchBar('🔍 Search shopping boards...');

        const gridContainer = document.createElement('div');
        gridContainer.className = 'dashboard-grid';
        mainDisplayBox.appendChild(gridContainer);

        if (userLists.length === 0) {
            const emptyText = document.createElement('p');
            emptyText.className = 'dashboard-empty-text';
            emptyText.textContent = 'No active shopping tracker boards found. Click "New List" to start!';
            mainDisplayBox.appendChild(emptyText);
        } else {
            filterDashboardCards();
        }

        changeListBtn.textContent = "Go to Active List";

    } else {
        // --- Render Active Target Shopping List View ---
        const targetList = userLists[activeListIndex];
        
        if (!targetList) {
            currentView = 'dashboard';
            renderApp();
            return;
        }

        // Return path indicator text link
        const navIndicator = document.createElement('span');
        navIndicator.className = 'home-nav-indicator';
        navIndicator.textContent = '← Back to Dashboard';
        navIndicator.addEventListener('click', () => {
            currentView = 'dashboard';
            searchQuery = ""; 
            renderApp();
        });
        mainDisplayBox.appendChild(navIndicator);

        const heading = document.createElement('h2');
        heading.className = 'list-title';
        heading.textContent = targetList.name;
        mainDisplayBox.appendChild(heading);

        // Inject Search Bar targeting list items
        injectSearchBar(`🔍 Search items in ${targetList.name}...`);

        const ul = document.createElement('ul');
        ul.className = 'shopping-list';
        mainDisplayBox.appendChild(ul);

        filterListRows();
        changeListBtn.textContent = "Go to Dashboard";
    }
}

// Sidebar Primary Action Listener Bindings
addItemBtn.addEventListener('click', () => {
    if (currentView !== 'list') {
        alert("Please select or open a specific shopping list board from your dashboard first!");
        return;
    }
    
    const text = prompt('Enter item name:');
    if (!text || text.trim() === '') return;

    userLists[activeListIndex].items.push({
        text: text.trim(),
        completed: false
    });
    saveToStorage();
    renderApp();
});
