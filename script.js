let appListsState = {
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

// Global App View Manager Route Path Tracking Index Context
let activeRoutePath = "home";

// Core Static Layout Mounting Frame Node Hooks Registry
const mainDisplayBox = document.getElementById('mainDisplayBox');
const leftSidebar = document.getElementById('leftSidebar');
const rightSidebar = document.getElementById('rightSidebar');
const homeLink = document.getElementById('homeLink');

// Main Framework Routing Master Renderer Switch Engine
function renderApplicationLayout() {
    // 1. Clear out sidebars completely to prevent dead node reference listener errors
    leftSidebar.innerHTML = '';
    rightSidebar.innerHTML = '';
    mainDisplayBox.innerHTML = '';

    if (activeRoutePath === "home") {
        buildHomepageWorkspace();
    } else {
        buildActiveListWorkspace();
    }
}

// 🏠 PAGE PANEL ONE: Build Pure Theme Cohesive Grid Homepage Screen Panel Environment
function buildHomepageWorkspace() {
    // Generate Right Panel Context Controls
    const newListBtn = document.createElement('button');
    newListBtn.className = 'btn btn-blue';
    newListBtn.textContent = 'New List';
    newListBtn.addEventListener('click', handleCreateNewCategoryList);
    rightSidebar.appendChild(newListBtn);

    // Build Central Dashboard Content Frame Canvas Elements
    const homeWrap = document.createElement('div');
    homeWrap.className = 'homepage-container';

    const mainHeaderTitle = document.createElement('h2');
    mainHeaderTitle.className = 'list-title';
    mainHeaderTitle.textContent = "Your Shopping Boards";
    homeWrap.appendChild(mainHeaderTitle);

    const cardsGrid = document.createElement('div');
    cardsGrid.className = 'dashboard-grid';

    const trackingKeys = Object.keys(appListsState);

    if (trackingKeys.length === 0) {
        const structuralEmptyRow = document.createElement('div');
        structuralEmptyRow.className = 'no-lists-message';
        structuralEmptyRow.textContent = "Your workspace dashboard is clear. Click 'New List' on the right panel to initialize a new tracker.";
        cardsGrid.appendChild(structuralEmptyRow);
    } else {
        trackingKeys.forEach(listKeyName => {
            const listCardNode = document.createElement('div');
            listCardNode.className = 'list-card';
            
            const internalCountSize = appListsState[listKeyName].length;
            listCardNode.innerHTML = `
                <div class="list-card-title">${listKeyName}</div>
                <div class="list-card-count">${internalCountSize} item${internalCountSize === 1 ? '' : 's'} logged</div>
            `;

            // Wire Card Navigation Switch Actions Trigger Events
            listCardNode.addEventListener('click', () => {
                activeRoutePath = listKeyName;
                renderApplicationLayout();
            });

            cardsGrid.appendChild(listCardNode);
        });
    }

    homeWrap.appendChild(cardsGrid);
    mainDisplayBox.appendChild(homeWrap);
}

// 🛒 PAGE PANEL TWO: Build Contextual Interactive Shopping Board Screen Panel
function buildActiveListWorkspace() {
    // A. Populate Left Control Sidebar Dashboard Elements Panel Node Rows
    const addItemBtn = document.createElement('button');
    addItemBtn.className = 'btn btn-orange';
    addItemBtn.innerHTML = 'Add Item <span class="plus-icon">+</span>';
    addItemBtn.addEventListener('click', handleAddNewRowItemRowItem);
    leftSidebar.appendChild(addItemBtn);

    const sortBtn = document.createElement('button');
    sortBtn.className = 'btn btn-orange';
    sortBtn.textContent = 'Sort List';
    sortBtn.addEventListener('click', handleAdvancedSortingWorkflowMenu);
    leftSidebar.appendChild(sortBtn);

    // B. Populate Right Control Sidebar Dashboard Elements Panel Node Rows
    const rightNewListBtn = document.createElement('button');
    rightNewListBtn.className = 'btn btn-blue';
    rightNewListBtn.textContent = 'New List';
    rightNewListBtn.addEventListener('click', handleCreateNewCategoryList);
    rightSidebar.appendChild(rightNewListBtn);

    const homepageReturnBtn = document.createElement('button');
    homepageReturnBtn.className = 'btn btn-teal';
    homepageReturnBtn.textContent = 'Go to Homepage';
    homepageReturnBtn.addEventListener('click', () => {
        activeRoutePath = "home";
        renderApplicationLayout();
    });
    rightSidebar.appendChild(homepageReturnBtn);

    const purgeListBtn = document.createElement('button');
    purgeListBtn.className = 'btn btn-red delete-btn';
    purgeListBtn.textContent = 'Delete Current List';
    purgeListBtn.addEventListener('click', handlePurgeActiveCategoryRecordMap);
    rightSidebar.appendChild(purgeListBtn);

    // C. Build Central Whiteboard Active Item Elements Rows Dashboard Canvas Setup
    const currentActiveHeaderName = activeRoutePath;
    const itemsDataArray = appListsState[currentActiveHeaderName];

    // Build Interactive Mutable Title Header Component View Setup Panel Nodes
    const titleHeaderNode = document.createElement('h2');
    titleHeaderNode.className = 'list-title editable-title-hint';
    titleHeaderNode.textContent = currentActiveHeaderName;
    titleHeaderNode.title = "Click to rename this list category title header instantly";
    titleHeaderNode.addEventListener('click', () => {
        const renamedInputTitle = prompt("Provide fresh nomenclature identification for this tracking list dashboard:", currentActiveHeaderName);
        if (renamedInputTitle !== null && renamedInputTitle.trim() !== "" && renamedInputTitle.trim() !== currentActiveHeaderName) {
            const formattedNewTitle = renamedInputTitle.trim();
            if (appListsState[formattedNewTitle]) {
                alert("A tracking data block register with that property key already exists.");
                return;
            }
            // Transition background keys memory state values seamlessly without data loss
            appListsState[formattedNewTitle] = appListsState[currentActiveHeaderName];
            delete appListsState[currentActiveHeaderName];
            activeRoutePath = formattedNewTitle;
            renderApplicationLayout();
        }
    });
    mainDisplayBox.appendChild(titleHeaderNode);

    const targetListContainerUl = document.createElement('ul');
    targetListContainerUl.className = 'shopping-list';

    if (!itemsDataArray || itemsDataArray.length === 0) {
        const emptyAlertNoticeText = document.createElement('p');
        emptyAlertNoticeText.style.color = '#777';
        emptyAlertNoticeText.style.fontStyle = 'italic';
        emptyAlertNoticeText.style.marginTop = '40px';
        emptyAlertNoticeText.textContent = "This active list collection dashboard has no records. Click 'Add Item' on the left panel to populate rows.";
        mainDisplayBox.appendChild(emptyAlertNoticeText);
    } else {
        itemsDataArray.forEach((itemObject, recordIndex) => {
            const liNodeRowElement = document.createElement('li');
            liNodeRowElement.className = 'list-item';

            // 1. Square Completion Checkbox Indicator Factory Block
            const statusCheckboxSquareBox = document.createElement('div');
            statusCheckboxSquareBox.className = 'status-square';
            if (itemObject.completed) {
                statusCheckboxSquareBox.style.backgroundColor = '#2ecc71';
                statusCheckboxSquareBox.style.borderColor = '#2ecc71';
                statusCheckboxSquareBox.innerHTML = '✓';
            }
            statusCheckboxSquareBox.addEventListener('click', (e) => {
                e.stopPropagation();
                itemObject.completed = !itemObject.completed;
                renderApplicationLayout();
            });
            liNodeRowElement.appendChild(statusCheckboxSquareBox);

            // 2. Colored Horizontal Text Description Blocks Frame Component Wrapper
            const elementTextBoxCanvas = document.createElement('div');
            elementTextBoxCanvas.className = 'item-text-box';
            elementTextBoxCanvas.textContent = itemObject.text;
            if (itemObject.completed) {
                elementTextBoxCanvas.classList.add('struck-through');
            }
            // Inline Single Item Mutation Edit Action Handler Row Trigger
            elementTextBoxCanvas.addEventListener('click', () => {
                const promptMutateTextStringValue = prompt("Modify current selected line context record parameter name:", itemObject.text);
                if (promptMutateTextStringValue !== null && promptMutateTextStringValue.trim() !== "") {
                    itemObject.text = promptMutateTextStringValue.trim();
                    renderApplicationLayout();
                }
            });
            liNodeRowElement.appendChild(elementTextBoxCanvas);

            // 3. Independent Single Row Destruction Pin Cross Button Component
            const individualItemPurgeBtn = document.createElement('button');
            individualItemPurgeBtn.className = 'delete-item-btn';
            individualItemPurgeBtn.innerHTML = '×';
            individualItemPurgeBtn.title = "Drop item record row";
            individualItemPurgeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                appListsState[activeRoutePath].splice(recordIndex, 1);
                renderApplicationLayout();
            });
            liNodeRowElement.appendChild(individualItemPurgeBtn);
