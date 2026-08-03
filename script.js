let listsData = JSON.parse(localStorage.getItem('shopTrackerData')) || {
    "Grocery List": [
        { text: "Milk", completed: false },
        { text: "Eggs", completed: true },
        { text: "Bread", completed: false }
    ],
    "School Supplies": [
        { text: "Notebooks", completed: false },
        { text: "Pens", completed: false }
    ]
};

let currentListKey = "Grocery List"; // Tracks active list name. Set to null for Dashboard View.

// --- DOM ELEMENT SELECTORS ---
const mainDisplayBox = document.getElementById('mainDisplayBox');
const addItemBtn = document.getElementById('addItemBtn');
const sortBtn = document.getElementById('sortBtn');
const newListBtn = document.getElementById('newListBtn');
const changeListBtn = document.getElementById('changeListBtn');
const deleteListBtn = document.getElementById('deleteListBtn');
const homeLink = document.getElementById('homeLink');

// --- HELPER FUNCTIONS ---
function saveToStorage() {
    localStorage.setItem('shopTrackerData', JSON.stringify(listsData));
}

// Builds individual shopping items (with checkbox, text canvas, and deletion pin)
function createListItemElement(item, index, listKey) {
    const li = document.createElement('li');
    li.className = 'list-item';

    // 1. Interactive Checkbox Square
    const checkBox = document.createElement('div');
    checkBox.className = 'status-square';
    if (item.completed) {
        checkBox.style.backgroundColor = '#2ecc71';
        checkBox.style.borderColor = '#2ecc71';
        checkBox.style.position = 'relative';
        checkBox.innerHTML = '<span style="color: white; font-size: 12px; position: absolute; top: -1px; left: 3px;">✓</span>';
    }
    checkBox.addEventListener('click', (e) => {
        e.stopPropagation();
        item.completed = !item.completed;
        saveToStorage();
        renderView();
    });
    li.appendChild(checkBox);

    // 2. Text Content Canvas Block
    const textBox = document.createElement('div');
    textBox.className = 'item-text-box';
    textBox.textContent = item.text;
    if (item.completed) {
        textBox.classList.add('struck-through');
    }
    textBox.addEventListener('click', () => {
        const updatedText = prompt('Edit item name:', item.text);
        if (updatedText && updatedText.trim() !== '') {
            item.text = updatedText.trim();
            saveToStorage();
            renderView();
        }
    });
    li.appendChild(textBox);

    // 3. Individual Deletion Pin
    const deletePin = document.createElement('button');
    deletePin.className = 'delete-item-btn';
    deletePin.innerHTML = '&times;';
    deletePin.setAttribute('aria-label', `Delete ${item.text}`);
    deletePin.addEventListener('click', () => {
        listsData[listKey].splice(index, 1);
        saveToStorage();
        renderView();
    });
    li.appendChild(deletePin);

    return li;
}

// --- RENDER CORE CONTROLLER ---
function renderView() {
    mainDisplayBox.innerHTML = '';

    // VIEW A: Render Dashboard Grid (If currentListKey is null)
    if (!currentListKey || !listsData[currentListKey]) {
        currentListKey = null;
        
        const title = document.createElement('h2');
        title.className = 'list-title';
        title.textContent = 'Your Storage Dashboard';
        mainDisplayBox.appendChild(title);

        const keys = Object.keys(listsData);
        if (keys.length === 0) {
            const emptyText = document.createElement('p');
            emptyText.className = 'dashboard-empty-text';
            emptyText.textContent = 'No active tracking lists found. Create one to get started!';
            mainDisplayBox.appendChild(emptyText);
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'dashboard-grid';

        keys.forEach(key => {
            const card = document.createElement('div');
            card.className = 'dashboard-card';
            card.textContent = `${key} (${listsData[key].length})`;
            card.addEventListener('click', () => {
                currentListKey = key;
                renderView();
            });
            grid.appendChild(card);
        });

        mainDisplayBox.appendChild(grid);
        return;
    }

    // VIEW B: Render Active Shopping List
    const title = document.createElement('h2');
    title.className = 'list-title';
    title.textContent = currentListKey;
    mainDisplayBox.appendChild(title);

    const ul = document.createElement('ul');
    ul.className = 'shopping-list';

    listsData[currentListKey].forEach((item, index) => {
        const li = createListItemElement(item, index, currentListKey);
        ul.appendChild(li);
    });

    mainDisplayBox.appendChild(ul);
}

// --- GLOBAL EVENT LISTENERS ---
addItemBtn.addEventListener('click', () => {
    if (!currentListKey) return alert('Please select or create an active tracking list first!');
    const text = prompt('Enter new item name:');
    if (!text || text.trim() === '') return;

    listsData[currentListKey].push({ text: text.trim(), completed: false });
    saveToStorage();
    renderView();
});

sortBtn.addEventListener('click', () => {
    if (!currentListKey) return;
    listsData[currentListKey].sort((a, b) => a.text.localeCompare(b.text));
    saveToStorage();
    renderView();
});

newListBtn.addEventListener('click', () => {
    const listName = prompt('Enter a title for your new tracking list:');
    if (!listName || listName.trim() === '') return;
    
    const formattedName = listName.trim();
    if (listsData[formattedName]) return alert('A list with that name already exists!');

    listsData[formattedName] = [];
    currentListKey = formattedName;
    saveToStorage();
    renderView();
});

changeListBtn.addEventListener('click', () => {
    currentListKey = null;
    renderView();
});

homeLink.addEventListener('click', () => {
    currentListKey = null;
    renderView();
});

deleteListBtn.addEventListener('click', () => {
    if (!currentListKey) return alert('No active list selected to delete.');
    if (confirm(`Are you sure you want to permanently delete "${currentListKey}"?`)) {
        delete listsData[currentListKey];
        const remainingKeys = Object.keys(listsData);
        currentListKey = remainingKeys.length > 0 ? remainingKeys[0] : null;
        saveToStorage();
        renderView();
    }
});

// Initial boot launch sequence
renderView();
