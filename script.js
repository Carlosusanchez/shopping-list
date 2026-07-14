// DOM Element Selectors
const shoppingList = document.getElementById('shoppingList');
const addItemBtn = document.getElementById('addItemBtn');
const sortBtn = document.getElementById('sortBtn');

// Hardcoded sample dataset to initialize the application view
const initialItems = [
    { text: "Milk", type: "main", completed: false },
    { text: "Organic Whole Milk", type: "sub", completed: false },
    { text: "Eggs", type: "main", completed: true },
    { text: "Bread", type: "main", completed: false }
];

// Helper function to build and render a list item DOM element
function createListItemElement(item) {
    const li = document.createElement('li');
    li.className = 'list-item';
    if (item.type === 'sub') {
        li.classList.add('sub-item');
    }

    // Create the appropriate geometric bullet indicator
    const bullet = document.createElement('span');
    if (item.type === 'main') {
        bullet.className = item.completed ? 'status-circle filled' : 'status-circle';
    } else {
        bullet.className = 'status-square'; // Sub-items get squares
    }
    li.appendChild(bullet);

    // Create the colored text block
    const textBox = document.createElement('div');
    textBox.className = 'item-text-box';
    textBox.className += item.type === 'main' ? ' purple-bg' : ' pink-bg';
    textBox.textContent = item.text;

    // Apply strikethrough states if active
    if (item.completed) {
        textBox.classList.add('struck-through');
    }

    // Toggle completion status on click
    textBox.addEventListener('click', () => {
        item.completed = !item.completed;
        if (item.completed) {
            textBox.classList.add('struck-through');
            if (item.type === 'main') bullet.className = 'status-circle filled';
        } else {
            textBox.classList.remove('struck-through');
            if (item.type === 'main') bullet.className = 'status-circle';
        }
    });

    li.appendChild(textBox);
    return li;
}

// Function to render the complete array data into the view container
function renderList(itemsArray) {
    shoppingList.innerHTML = '';
    itemsArray.forEach(item => {
        const itemElement = createListItemElement(item);
        shoppingList.appendChild(itemElement);
    });
}

// Event Listener: Add new item or sub-item
addItemBtn.addEventListener('click', () => {
    const text = prompt('Enter item name:');
    if (!text || text.trim() === '') return;

    const isSub = confirm('Is this a sub-item under the previous main entry?');
    
    const newItem = {
        text: text.trim(),
        type: isSub ? 'sub' : 'main',
        completed: false
    };

    initialItems.push(newItem);
    renderList(initialItems);
});

// Event Listener: Sort elements alphabetically
sortBtn.addEventListener('click', () => {
    // Sort array by text value
    initialItems.sort((a, b) => a.text.localeCompare(b.text));
    renderList(initialItems);
});

// Initial application boot load
renderList(initialItems);
