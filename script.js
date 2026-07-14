let appListsData = {
    "Weekly Groceries": [
        { text: "Fresh Milk", completed: false },
        { text: "Organic Eggs", completed: true },
        { text: "Whole Wheat Bread", completed: false }
    ],
    "Home Improvement": [
        { text: "Steel Hammer", completed: false },
        { text: "Galvanized Nails", completed: false }
    ]
};

// Variable tracking active rendering pane context ('home' or a specific list string name)
let currentView = "home"; 

// DOM Element Registry Mapping hooks
const mainDisplayBox = document.getElementById('mainDisplayBox');
const leftSidebar = document.getElementById('leftSidebar');
const addItemBtn = document.getElementById('addItemBtn');
const sortBtn = document.getElementById('sortBtn');
const homeLink = document.getElementById('homeLink');

// Navigation management hooks
const newListBtn = document.getElementById('newListBtn');
const changeListBtn = document.getElementById('changeListBtn');
const deleteListBtn = document.getElementById('deleteListBtn');

// Primary UI Switch Routing engine
function renderInterface() {
    if (currentView === "home") {
        // Hide list adjustment controls when on the home menu
        leftSidebar.style.visibility = "hidden";
        deleteListBtn.style.display = "none";
        renderHomeDashboard();
    } else {
        // Display list contextual settings 
        leftSidebar.style.visibility = "visible";
        deleteListBtn.style.display = "block";
        renderActiveShoppingList();
    }
}

// Render Engine: Home Dashboard Grid
function renderHomeDashboard() {
    mainDisplayBox.innerHTML = '';

    const title = document.createElement('h2');
    title.className = 'list-title';
    title.textContent = "📋 Saved Lists Dashboard";
    mainDisplayBox.appendChild(title);

    const listNames = Object.keys(appListsData);

    if (listNames.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'dashboard-empty-text';
        emptyMsg.textContent = "No active lists found. Click 'New List' on the right panel to get started!";
        mainDisplayBox.appendChild(emptyMsg);
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'dashboard-grid';

    listNames.forEach(name => {
        const card = document.createElement('div');
        card.className = 'dashboard-card';
        
        // Output title context alongside counting tracking metadata indicators
        const itemCount = appListsData[name].length;
        card.innerHTML = `<div>${name}</div><div style="font-size:0.85rem; font-weight:normal; margin-top:8px; opacity:0.8;">${itemCount} item${itemCount === 1 ? '' : 's'}</div>`;
        
        card.addEventListener('click', () => {
            currentView = name;
            renderInterface();
        });
        grid.appendChild(card);
    });

    mainDisplayBox.appendChild(grid);
}

// Render Engine: Active Target Shopping List Layout
function renderActiveShoppingList() {
    mainDisplayBox.innerHTML = '';

    // Navigation breadcrumb link back home
    const backHomeNav = document.createElement('span');
    backHomeNav.className = 'home-nav-indicator';
    backHomeNav.textContent = "← Back to Home Dashboard";
    backHomeNav.addEventListener('click', () => {
        currentView = "home";
        renderInterface();
    });
    mainDisplayBox.appendChild(backHomeNav);

    // List Header Context
    const title = document.createElement('h2');
    title.className = 'list-title';
    title.textContent = currentView;
    mainDisplayBox.appendChild(title);

    // Structured List Wrapper Elements Container
    const ul = document.createElement('ul');
    ul.className = 'shopping-list';
    ul.id = 'shoppingList';

    const currentItems = appListsData[currentView];

    if (!currentItems || currentItems.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'dashboard-empty-text';
        emptyMsg.textContent = "This list is currently empty. Add your first item using the left sidebar panel!";
        mainDisplayBox.appendChild(emptyMsg);
    } else {
        currentItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'list-item';

            // 1. Core Square Interactive Status Box Element Component Factory 
            const checkBox = document.createElement('div');
            checkBox.className = 'status-square';
            
            if (item.completed) {
                checkBox.style.backgroundColor = '#2ecc71';
                checkBox.style.borderColor = '#2ecc71';
                checkBox.innerHTML = '✓';
            }

            checkBox.addEventListener('click', (e) => {
                e.stopPropagation(); // Shield baseline block edits triggers on toggle interactions
                item.completed = !item.completed;
                renderInterface();
            });
            li.appendChild(checkBox);

            // 2. Colored Context Description Block Element Canvas Component Factory
            const textBox = document.createElement('div');
            textBox.className = 'item-text-box';
            textBox.textContent = item.text;

            if (item.completed) {
                textBox.classList.add('struck-through');
            }

            // Click Text box element wrapper to launch inline title mutation prompts
            textBox.addEventListener('click', () => {
                const updatedText = prompt('Modify selected listing description title:', item.text);
                if (updatedText !== null && updatedText.trim() !== '') {
                    item.text = updatedText.trim();
                    renderInterface();
                }
            });
            li.appendChild(textBox);

            // 3. Independent Destruction Element Target Button
            const deleteItemBtn = document.createElement('button');
            deleteItemBtn.className = 'delete-item-btn';
            deleteItemBtn.innerHTML = '×';
            deleteItemBtn.title = 'Remove item from list';
            deleteItemBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                appListsData[currentView].splice(index, 1);
                renderInterface();
            });
            li.appendChild(deleteItemBtn);

            ul.appendChild(li);
        });
        
        mainDisplayBox.appendChild(ul);
    }
}

/* --- ACTION HOOK CONTROLS EVENT HANDLERS --- */

// Left Panel: Dynamic prompt appending context structures
addItemBtn.addEventListener('click', () => {
    if (currentView === "home") return;

    const text = prompt('Identify description parameters for new line record:');
    if (!text || text.trim() === '') return;

    appListsData[currentView].push({
        text: text.trim(),
        completed: false
    });
    renderInterface();
});

// Left Panel: Sophisticated Multi-Tier Custom sorting router engines
sortBtn.addEventListener('click', () => {
    if (currentView === "home") return;

    const sortChoice = prompt(
        "Select Organization Metric Strategy Option Number:\n\n" +
        "1: Sort Alphabetically (A to Z)\n" +
        "2: Sort Checked Status (Active Open items moved to top)\n" +
        "3: Combined Hybrid (Active Alphabetical first, followed by Checked Alphabetical)"
    );

    const activeList = appListsData[currentView];

    if (sortChoice === '1') {
        activeList.sort((a, b) => a.text.localeCompare(b.text));
    } else if (sortChoice === '2') {
        activeList.sort((a, b) => a.completed - b.completed);
    } else if (sortChoice === '3') {
        activeList.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed - b.completed;
            }
            return a.text.localeCompare(b.text);
        });
    } else if (sortChoice !== null) {
        alert("Selection option error matching structural parsing criteria registry rules map index.");
        return;
    }
    renderInterface();
});

// Right Panel: Instantiates tracking collections maps without dropping historic context values
newListBtn.addEventListener('click', () => {
    const freshListName = prompt('Assign title identity token identifier configuration header context:');
    if (!freshListName || freshListName.trim() === '') return;

    const parsedName = freshListName.trim();
    if (appListsData[parsedName]) {
        alert('A tracked shopping list container processing matching target signature properties already exists.');
        return;
    }

    // Allocate configuration canvas registers map properties objects
    appListsData[parsedName] = [];
    currentView = parsedName;
    renderInterface();
});

// Right Panel: Redirect actions navigation contexts targeting home maps dashboard registers
changeListBtn.addEventListener('click', () => {
    currentView = "home";
    renderInterface();
});

// Right Panel: Purges target configurations map keys arrays entirely
deleteListBtn.addEventListener('click', () => {
    if (currentView === "home") return;

    const userConfirmation = confirm(`Are you completely sure you want to permanently delete "${currentView}" list structures?`);
    if (!userConfirmation) return;

    delete appListsData[currentView];
    currentView = "home"; // Redirect user context safely to main landing layouts panel view space
    renderInterface();
});

// Bind top document headline text elements layout triggers to invoke homepage view properties rerouting
homeLink.addEventListener('click', () => {
    currentView = "home";
    renderInterface();
});

// Initialize Framework Application runtime loop sequences on load configurations mapping instances
renderInterface();
