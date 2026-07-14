javascript// DOM Element Selectors
const shoppingList = document.getElementById('shoppingList');
const addItemBtn = document.getElementById('addItemBtn');
const sortBtn = document.getElementById('sortBtn');
const listTitle = document.querySelector('.list-title');

// Right System Controls Sidebar Buttons
const newListBtn = document.querySelector('.btn-blue');
const changeListBtn = document.querySelector('.btn-teal');
const deleteListBtn = document.querySelector('.delete-btn');

// Application Data State
let lists = {
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
let currentListName = "Groceries";

// Helper function to build and render a single list item
function createListItemElement(item, index) {
    const li = document.createElement('li');
    li.className = 'list-item';

    // 1. Checkbox container (small square box)
    const checkBox = document.createElement('div');
    checkBox.className = 'status-square';
    
    if (item.completed) {
        checkBox.style.backgroundColor = '#2ecc71';
        checkBox.style.borderColor = '#2ecc71';
        checkBox.style.position = 'relative';
        checkBox.innerHTML = '<span style="color: white; font-size: 12px; position: absolute; top: -1px; left: 3px;">✓</span>';
    } else {
        checkBox.style.backgroundColor = 'transparent';
        checkBox.innerHTML = '';
    }

    checkBox.addEventListener('click', (e) => {
        e.stopPropagation();
        item.completed = !item.completed;
        renderList();
    });
    li.appendChild(checkBox);

    // 2. Text container block
    const textBox = document.createElement('div');
    textBox.className = 'item-text-box purple-bg';
    textBox.textContent = item.text;

    if (item.completed) {
        textBox.classList.add('struck-through');
    }

    // Inline Edit Feature
    textBox.addEventListener('click', () => {
        const updatedText = prompt('Edit your item name:', item.text);
        if (updatedText !== null && updatedText.trim() !== '') {
            item.text = updatedText.trim();
            renderList();
        }
    });
    li.appendChild(textBox);

    // 3. Delete single item action button
    const deleteItemBtn = document.createElement('button');
    deleteItemBtn.className = 'delete-item-btn';
    deleteItemBtn.innerHTML = '×';
    deleteItemBtn.title = 'Delete Item';
    deleteItemBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        lists[currentListName].splice(index, 1);
        renderList();
    });
    li.appendChild(deleteItemBtn);

    return li;
}

// Function to render the active list to the DOM
function renderList() {
    shoppingList.innerHTML = '';
    listTitle.textContent = currentListName;
    
    const currentItems = lists[currentListName];
    if (!currentItems || currentItems.length === 0) return;

    currentItems.forEach((item, index) => {
        const itemElement = createListItemElement(item, index);
        shoppingList.appendChild(itemElement);
    });
}

// Left Sidebar: Add item
addItemBtn.addEventListener('click', () => {
    const text = prompt('Enter new item name:');
    if (!text || text.trim() === '') return;

    lists[currentListName].push({
        text: text.trim(),
        completed: false
    });
    renderList();
});

// Left Sidebar: Multi-option sorting selection prompt
sortBtn.addEventListener('click', () => {
    const choice = prompt(
        "Choose sorting option:\n" +
        "1 - Sort Alphabetically\n" +
        "2 - Sort by Checked Off Status\n" +
        "3 - Sort by both (Unchecked Alphabetical first, then Checked Alphabetical)"
    );

    const currentItems = lists[currentListName];

    if (choice === '1') {
        currentItems.sort((a, b) => a.text.localeCompare(b.text));
    } else if (choice === '2') {
        currentItems.sort((a, b) => a.completed - b.completed);
    } else if (choice === '3') {
        currentItems.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed - b.completed;
            }
            return a.text.localeCompare(b.text);
        });
    } else {
        alert("Invalid option selected.");
        return;
    }
    renderList();
});

// Right Sidebar: Create a new list while retaining active structures
newListBtn.addEventListener('click', () => {
    const newName = prompt('Enter a name for your new shopping list:');
    if (!newName || newName.trim() === '') return;

    const formattedName = newName.trim();
    if (lists[formattedName]) {
        alert('A list with that name already exists!');
        return;
    }

    lists[formattedName] = [];
    currentListName = formattedName;
    renderList();
});

// Right Sidebar: Toggle layout selection between previously built active states
changeListBtn.addEventListener('click', () => {
    const availableLists = Object.keys(lists);
    const selection = prompt(
        `Available lists:\n${availableLists.join('\n')}\n\nType the exact name of the list you want to switch to:`
    );

    if (selection && lists[selection.trim()]) {
        currentListName = selection.trim();
        renderList();
    } else if (selection) {
        alert("List name not found.");
    }
});

// Right Sidebar: Purge active layout list
deleteListBtn.addEventListener('click', () => {
    const confirmDelete = confirm(`Are you sure you want to delete the complete list "${currentListName}"?`);
    if (!confirmDelete) return;

    delete lists[currentListName];
    const availableLists = Object.keys(lists);

    if (availableLists.length > 0) {
        currentListName = availableLists[0];
    } else {
        lists["Default List"] = [];
        currentListName = "Default List";
    }
    renderList();
});

// Initial boot launch sequence
renderList();
