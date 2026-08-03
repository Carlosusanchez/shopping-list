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
let searchQuery = ""; // Simple text filter variable

// Central Data Layer with localStorage integration
let userLists = [];

// 1. SAFE STORAGE LOAD
const savedData = localStorage.getItem('shoppingTrackerData');
if (savedData) {
    userLists = JSON.parse(savedData);
} else {
    // Default starter boards if localStorage is clean
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

// 2. SAFE STORAGE SAVE
function saveToStorage() {
    localStorage.setItem('shoppingTrackerData', JSON.stringify(userLists));
}

// Helper function to build a single list item line matching your CSS layout
function createListItemElement(item, itemIndex, listItemsArray) {
    const li = document.createElement('li');
    li.className = 'list-item';

    // Interactive Checkbox Square (.status-square)
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

    // Main Title Canvas Block (.item-text-box)
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

    // Destructive Action Pin Button (.delete-item-btn)
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

// Helper function to create the simple search input field
function createSearchInputElement(placeholderText) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = placeholderText;
    input.value = searchQuery;
    
    // Fallback styles to ensure it looks balanced in the display board
    input.style.width = '100%';
    input.style.padding = '10px 15px';
    input.style.marginBottom = '20px';
    input.style.border = '1px solid #ccc';
    input.style.borderRadius = '20px';
    input.style.boxSizing = 'border-box';
    input.style.fontSize = '1rem';

    // Re-renders the display instantly as you type
    input.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderApp();
        // Keeps the cursor focus in the input while typing
        input.focus();
    });

    return input;
}

// Master Rendering Hub (The exact framework that worked before, cleanly updated)
function renderApp() {
    mainDisplayBox.innerHTML = '';
    const lowerQuery = searchQuery.toLowerCase().trim();

    if (currentView === 'dashboard') {
        // --- Render Dashboard Canvas View ---
        const heading = document.createElement('h2');
        heading.className = 'list-title';
        heading.textContent = 'Your Shopping Boards';
        mainDisplayBox.appendChild(heading);

        // Inject Search Bar
        const searchInput = createSearchInputElement('🔍 Search shopping boards...');
        mainDisplayBox.appendChild(searchInput);
        // Maintain cursor focus stability across immediate screen redraws
        if (searchQuery !== "") searchInput.focus();

        const gridContainer = document.createElement('div');
        gridContainer.className = 'dashboard-grid';

        let visibleCards = 0;

        userLists.forEach((list, idx) => {
            // Filter rule logic: skip card if it doesn't match search term
            if (lowerQuery && !list.name.toLowerCase().includes(lowerQuery)) return;
            visibleCards++;

            const card = document.createElement('div');
            card.className = 'dashboard-card';
            
            const incompleteCount = list.items.filter(i => !i.completed).length;
            card.innerHTML = `${list.name}<br><span style="font-size: 0.8rem; font-weight: normal; opacity: 0.7;">(${incompleteCount} items left)</span>`;

            card.addEventListener('click', () => {
                activeListIndex = idx;
                currentView = 'list';
                searchQuery = ""; // Clear text field when entering a list
                renderApp();
            });
            gridContainer.appendChild(card);
        });

        mainDisplayBox.appendChild(gridContainer);

        if (visibleCards === 0 && userLists.length > 0) {
            const noResults = document.createElement('p');
            noResults.className = 'dashboard-empty-text';
            noResults.textContent = 'No matching boards found.';
            mainDisplayBox.appendChild(noResults);
        } else if (userLists.length === 0) {
            const emptyText = document.createElement('p');
            emptyText.className = 'dashboard-empty-text';
            emptyText.textContent = 'No active shopping tracker boards found. Click "New List" to start!';
            mainDisplayBox.appendChild(emptyText);
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

        // Inject Search Bar
        const searchInput = createSearchInputElement(`🔍 Search items in ${targetList.name}...`);
        mainDisplayBox.appendChild(searchInput);
        if (searchQuery !== "") searchInput.focus();

        const ul = document.createElement('ul');
        ul.className = 'shopping-list';

        targetList.items.forEach((item, index) => {
            // Filter rule logic: skip row if it doesn't match search term
            if (lowerQuery && !item.text.toLowerCase().includes(lowerQuery)) return;
            
            const liElement = createListItemElement(item, index, targetList.items);
            ul.appendChild(liElement);
        });

        mainDisplayBox.appendChild(ul);
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

sortBtn.addEventListener('click', () => {
    if (currentView !== 'list') return;
    userLists[activeListIndex].items.sort((a, b) => a.text.localeCompare(b.text));
    saveToStorage();
    renderApp();
});

changeListBtn.addEventListener('click', () => {
    currentView = (currentView === 'list') ? 'dashboard' : 'list';
    searchQuery = ""; 
    renderApp();
});

newListBtn.addEventListener('click', () => {
    const listName = prompt('Enter a name for your new shopping list:');
    if (!listName || listName.trim() === '') return;

    const newListObj = {
        name: listName.trim(),
        items: []
    };

    userLists.push(newListObj);
    activeListIndex = userLists.length - 1;
    currentView = 'list';
    searchQuery = ""; 
    saveToStorage();
    renderApp();
});

deleteListBtn.addEventListener('click', () => {
    if (userLists.length === 0) return;
    
    const confirmation = confirm(`Are you sure you want to permanently delete the current list container?`);
    if (!confirmation) return;

    if (currentView === 'list') {
        userLists.splice(activeListIndex, 1);
