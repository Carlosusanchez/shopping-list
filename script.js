// DOM Element Selectors
const shoppingList = document.getElementById('shoppingList');
const addItemBtn = document.getElementById('addItemBtn');
const sortBtn = document.getElementById('sortBtn');

// Array to hold shopping list item data
let itemsData = [
    { text: "Milk", completed: false },
    { text: "Eggs", completed: true },
    { text: "Bread", completed: false }
];

// Helper function to build and render a list item DOM element
function createListItemElement(item, index) {
    const li = document.createElement('li');
    li.className = 'list-item';

    // 1. Create the checkbox container (the small square box)
    const checkBox = document.createElement('div');
    checkBox.className = 'status-square';
    
    // Add custom styling inline to handle the green check mark when completed
    if (item.completed) {
        checkBox.style.backgroundColor = '#2ecc71';
        checkBox.style.borderColor = '#2ecc71';
        checkBox.style.position = 'relative';
        checkBox.innerHTML = '<span style="color: white; font-size: 12px; position: absolute; top: -1px; left: 3px;">✓</span>';
    } else {
        checkBox.style.backgroundColor = 'transparent';
        checkBox.innerHTML = '';
    }

    // Toggle complete/incomplete when clicking the square box
    checkBox.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents triggering the text edit behavior
        item.completed = !item.completed;
        renderList();
    });
    li.appendChild(checkBox);

    // 2. Create the text container block
    const textBox = document.createElement('div');
    textBox.className = 'item-text-box purple-bg';
    textBox.textContent = item.text;

    // Apply strikethrough logic if completed
    if (item.completed) {
        textBox.classList.add('struck-through');
    }

    // Inline Edit Feature: Click the text block to rename the item
    textBox.addEventListener('click', () => {
        const updatedText = prompt('Edit your item name:', item.text);
        if (updatedText !== null && updatedText.trim() !== '') {
            item.text = updatedText.trim();
            renderList();
        }
    });

    li.appendChild(textBox);
    return li;
}

// Function to render the complete array data into the view container
function renderList() {
    shoppingList.innerHTML = '';
    itemsData.forEach((item, index) => {
        const itemElement = createListItemElement(item, index);
        shoppingList.appendChild(itemElement);
    });
}

// Event Listener: Add new item via prompt window
addItemBtn.addEventListener('click', () => {
    const text = prompt('Enter new item name:');
    if (!text || text.trim() === '') return;

    const newItem = {
        text: text.trim(),
        completed: false
    };

    itemsData.push(newItem);
    renderList();
});

// Event Listener: Sort elements alphabetically
sortBtn.addEventListener('click', () => {
    itemsData.sort((a, b) => a.text.localeCompare(b.text));
    renderList();
});

// Initial boot load to populate list
renderList();

