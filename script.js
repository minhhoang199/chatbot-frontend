// Track currently open menu
let currentOpenMenu = null;

// Function to toggle menu visibility
function toggleMenu(event, menuId) {
    event.stopPropagation();
    
    const menu = document.getElementById(menuId);
    const allMenus = document.querySelectorAll('.context-menu');
    
    // Close all other menus
    allMenus.forEach(m => {
        if (m.id !== menuId) {
            m.classList.remove('active');
        }
    });
    
    // Remove existing backdrop
    removeBackdrop();
    
    // Toggle current menu
    if (menu.classList.contains('active')) {
        menu.classList.remove('active');
        currentOpenMenu = null;
    } else {
        menu.classList.add('active');
        currentOpenMenu = menuId;
        createBackdrop();
    }
}

// Function to create backdrop for closing menu when clicking outside
function createBackdrop() {
    const backdrop = document.createElement('div');
    backdrop.className = 'menu-backdrop';
    backdrop.onclick = closeAllMenus;
    document.body.appendChild(backdrop);
}

// Function to remove backdrop
function removeBackdrop() {
    const backdrop = document.querySelector('.menu-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
}

// Function to close all menus
function closeAllMenus() {
    const allMenus = document.querySelectorAll('.context-menu');
    allMenus.forEach(menu => {
        menu.classList.remove('active');
    });
    removeBackdrop();
    currentOpenMenu = null;
}

// Function to handle menu actions
function handleAction(action) {
    console.log(`Action clicked: ${action}`);
    
    // Here you can add specific functionality for each action
    switch(action) {
        case 'unsend':
            alert('Message unsent (demo)');
            break;
        case 'forward':
            alert('Forward message (demo)');
            break;
        case 'pin':
            alert('Message pinned (demo)');
            break;
        case 'report':
            alert('Message reported (demo)');
            break;
        case 'reply':
            alert('Reply to message (demo)');
            break;
        default:
            alert(`${action} clicked`);
    }
    
    // Close menu after action
    closeAllMenus();
}

// Close menus when clicking outside or pressing Escape
document.addEventListener('click', (event) => {
    if (!event.target.closest('.message-actions')) {
        closeAllMenus();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeAllMenus();
    }
});

// Prevent menu from closing when clicking inside it
document.addEventListener('click', (event) => {
    if (event.target.closest('.context-menu')) {
        event.stopPropagation();
    }
});

// Add smooth scrolling behavior
document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});

// Optional: Add keyboard navigation for menu items
document.addEventListener('keydown', (event) => {
    if (currentOpenMenu) {
        const menu = document.getElementById(currentOpenMenu);
        const menuItems = menu.querySelectorAll('.menu-item');
        let currentFocus = -1;
        
        // Find currently focused item
        menuItems.forEach((item, index) => {
            if (item === document.activeElement) {
                currentFocus = index;
            }
        });
        
        switch(event.key) {
            case 'ArrowDown':
                event.preventDefault();
                currentFocus = (currentFocus + 1) % menuItems.length;
                menuItems[currentFocus].focus();
                break;
            case 'ArrowUp':
                event.preventDefault();
                currentFocus = currentFocus <= 0 ? menuItems.length - 1 : currentFocus - 1;
                menuItems[currentFocus].focus();
                break;
            case 'Enter':
                if (currentFocus >= 0) {
                    event.preventDefault();
                    menuItems[currentFocus].click();
                }
                break;
        }
    }
});

// Make menu items focusable for keyboard navigation
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.setAttribute('tabindex', '0');
    });
});