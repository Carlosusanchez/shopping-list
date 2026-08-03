// --- DATABASE & APP STATE ---
let appData = JSON.parse(localStorage.getItem('trackerLists')) || {
    "Weekly Groceries": [
        { text: "Milk", completed: false },
        { text: "Eggs", completed: true },
        { text: "Bread", completed: false }
    ],
    "School Projects": [
        { text: "Finish Coding Layout", completed: false },
        { text: "Write Project Report", completed: false }
    ]
};

// FIX: Grab the first available list string cleanly instead of the whole array
const existingKeys = Object.keys(appData);
let activeListKey = existingKeys.length > 0 ? existingKeys[0] : null;

// --- DOM CONFIGURATION INTERFACE ---
const mainDisplayBox = document.getElementById('mainDisplayBox');
const addItemBtn = document.getElementById('addItemBtn');
const sortBtn = document.getElementById('sortBtn');
const newListBtn = document.getElementById('newListBtn');
const changeListBtn = document.getElementById('changeListBtn');
const deleteListBtn = document.getElementById('deleteListBtn');
const homeLink = document.getElementById('homeLink');

// --- APP UTILITIES ---
function syncStorage() {
    localStorage.setItem('trackerLists', JSON.stringify(appData));
}

// --- VIEW CONTROLLERS ---

// Displays dashboard cards showing every individual tracker file
function renderDashboardView() {
    activeListKey = null;
    mainDisplayBox.innerHTML = '';

    const heading = document.createElement('h2');
    heading.className = 'list-title';
    heading.textContent = 'Digital Storage Dashboard';
    mainDisplayBox.appendChild(heading);

    const keys = Object.keys(appData);
    if (keys.length === 0) {
        const fallbackMessage = document.createElement('p');
        fallbackMessage.className = 'dashboard-empty-text';
        fallbackMessage.textContent = 'No tracking lists found. Click "New List" to start tracker.';
        mainDisplayBox.appendChild(fallbackMessage);
        return;
    }

    const gridLayout = document.createElement('div');
    gridLayout.className = 'dashboard-grid';

    keys.forEach(nameKey => {
        const listCard = document.createElement('div');
        listCard.className = 'dashboard-card';
        listCard.textContent = `${nameKey} (${appData[nameKey].length} items)`;
        
        listCard.addEventListener('click', () => {
            activeListKey = nameKey;
            renderActiveListView();
        });
        gridLayout.appendChild(listCard);
    });

    mainDisplayBox.appendChild(gridLayout);
}

// Displays lines inside a selected tracked shopping folder
function renderActiveListView() {
    if (!activeListKey || !appData[activeListKey]) {
        renderDashboardView();
        return;
    }

    mainDisplayBox.innerHTML = '';

    const listTitle = document.createElement('h2');
    listTitle.className = 'list-title';
    listTitle.textContent = activeListKey;
    mainDisplayBox.appendChild(listTitle);

    const itemContainerUL = document.createElement('ul');
    itemContainerUL.className = 'shopping-list';

    appData[activeListKey].forEach((itemObject, itemIndex) => {
        const itemLI = document.createElement('li');
        itemLI.className = 'list-item';

        // Checkbox square
        const checkSquare = document.createElement('div');
        checkSquare.className = 'status-square';
        if (itemObject.completed) {
            checkSquare.style.backgroundColor = '#2ecc71';
            checkSquare.style.borderColor = '#2ecc71';
            checkSquare.style.position = 'relative';
            checkSquare.innerHTML = '<span style="color:white; font-size:12px; position:absolute; top:-2px; left:2px;">✓</span>';
        }
        checkSquare.addEventListener('click', (event) => {
            event.stopPropagation();
            itemObject.completed = !itemObject.completed;
            syncStorage();
            renderActiveListView();
        });

        // Item title canvas plate
        const visualTextCanvas = document.createElement('div');
        visualTextCanvas.className = 'item-text-box';
        visualTextCanvas.textContent = itemObject.text;
        if (itemObject.completed) {
            visualTextCanvas.classList.add('struck-through');
        }
        visualTextCanvas.addEventListener('click', () => {
            const freshName = prompt('Update item label:', itemObject.text);
            if (freshName && freshName.trim() !== '') {
                itemObject.text = freshName.trim();
                syncStorage();
                renderActiveListView();
            }
        });

        // Delete structural single items button
        const itemTrashButton = document.createElement('button');
        itemTrashButton.className = 'delete-item-btn';
        itemTrashButton.innerHTML = '&times;';
        itemTrashButton.addEventListener('click', (event) => {
            event.stopPropagation();
            appData[activeListKey].splice(itemIndex, 1);
            syncStorage();
            renderActiveListView();
        });

        itemLI.appendChild(checkSquare);
        itemLI.appendChild(visualTextCanvas);
        itemLI.appendChild(itemTrashButton);
        itemContainerUL.appendChild(itemLI);
    });

    mainDisplayBox.appendChild(itemContainerUL);
}

// --- INTERACTIVE EVENT LISTENERS ---

addItemBtn.addEventListener('click', () => {
    // FAIL-SAFE: If no list is open, create or select one automatically so adding works
    if (!activeListKey) {
        const keys = Object.keys(appData);
        if (keys.length > 0) {
            activeListKey = keys[0];
        } else {
            const autoTitle = prompt('You do not have a list open. Enter a title to create one:');
            if (!autoTitle || autoTitle.trim() === '') return;
            activeListKey = autoTitle.trim();
            appData[activeListKey] = [];
        }
    }
    
    const itemLabel = prompt(`Adding item to "${activeListKey}". Enter item name:`);
    if (!itemLabel || itemLabel.trim() === '') return;

    appData[activeListKey].push({ text: itemLabel.trim(), completed: false });
    syncStorage();
    renderActiveListView();
});

sortBtn.addEventListener('click', () => {
    if (!activeListKey) return;
    appData[activeListKey].sort((alpha, beta) => alpha.text.localeCompare(beta.text));
    syncStorage();
    renderActiveListView();
});

newListBtn.addEventListener('click', () => {
    const listTitleInput = prompt('Enter a title for your new shopping tracking board:');
    if (!listTitleInput || listTitleInput.trim() === '') return;

    const refinedTitle = listTitleInput.trim();
    if (appData[refinedTitle]) {
        alert('A tracking dashboard list already uses that name.');
        return;
    }

    appData[refinedTitle] = [];
    activeListKey = refinedTitle;
    syncStorage();
    renderActiveListView();
});

changeListBtn.addEventListener('click', renderDashboardView);
homeLink.addEventListener('click', renderDashboardView);

deleteListBtn.addEventListener('click', () => {
    if (!activeListKey) {
        alert('No active shopping canvas list selected to delete.');
        return;
    }
    if (confirm(`Permanently delete current list: "${activeListKey}"?`)) {
        delete appData[activeListKey];
        syncStorage();
        const availableLists = Object.keys(appData);
        activeListKey = availableLists.length > 0 ? availableLists : null;
        if (activeListKey) {
            renderActiveListView();
        } else {
            renderDashboardView();
        }
    }
});

// --- CORE BOOT INITIALIZATION ---
if (activeListKey) {
    renderActiveListView();
} else {
    renderDashboardView();
}
