console.log("Script started");

function createColorTable(sectionName, colorData) {
    console.log(`Creating table for section: ${sectionName}`);
    const section = document.createElement('div');
    section.className = 'mb-8';
    
    // Create section heading with arrow
    const heading = document.createElement('div');
    heading.className = 'flex items-center justify-between text-2xl font-bold mb-4 text-gray-800 border-b pb-2 cursor-pointer';
    heading.innerHTML = `
        <span>${sectionName}</span>
        <i data-lucide="chevron-down" class="w-6 h-6 transform transition-transform duration-200"></i>
    `;
    section.appendChild(heading);

    const table = document.createElement('table');
    table.className = 'w-full border-collapse table-fixed hidden';
    
    // Create table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th class="border p-2 bg-gray-100 font-semibold text-gray-700 w-1/4">Element</th>
            <th class="border p-2 bg-gray-100 font-semibold text-gray-700 w-1/6">State</th>
            <th class="border p-2 bg-gray-100 font-semibold text-gray-700" style="width: 15%;">Light Mode</th>
            <th class="border p-2 bg-gray-100 font-semibold text-gray-700" style="width: 15%;">Dark Mode</th>
            <th class="border p-2 bg-gray-100 font-semibold text-gray-700 tailwind-column" style="width: 15%;">Light Mode (Tailwind)</th>
            <th class="border p-2 bg-gray-100 font-semibold text-gray-700 tailwind-column" style="width: 15%;">Dark Mode (Tailwind)</th>
        </tr>
    `;
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    colorData.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.className = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
        tr.innerHTML = `
            <td class="border p-2 font-medium text-gray-800 w-1/4 truncate">${row.element}</td>
            <td class="border p-2 text-gray-600 w-1/6 truncate">${row.state}</td>
            <td class="border p-0" style="width: 15%;">${createColorCell(row.lightMode, row.lightMode, false)}</td>
            <td class="border p-0" style="width: 15%;">${createColorCell(row.darkMode, row.darkMode, false)}</td>
            <td class="border p-0 tailwind-column" style="width: 15%;">${createColorCell(getTailwindColor(row.lightTailwind), row.lightTailwind, true)}</td>
            <td class="border p-0 tailwind-column" style="width: 15%;">${createColorCell(getTailwindColor(row.darkTailwind), row.darkTailwind, true)}</td>
        `;
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    section.appendChild(table);

    // Add click event to toggle table visibility
    heading.addEventListener('click', () => {
        table.classList.toggle('hidden');
        heading.querySelector('[data-lucide="chevron-down"]').classList.toggle('rotate-180');
    });

    // Add table to the container
    const container = document.getElementById('tableContainer');
    if (container) {
        container.appendChild(section);
        console.log(`Table appended for section: ${sectionName}`);
    } else {
        console.error("tableContainer not found");
    }
}

function createColorCell(backgroundColor, text, isTailwind) {
    const textColor = getContrastColor(backgroundColor);
    const cellContent = isTailwind ? text : backgroundColor;
    return `<div class="color-cell w-full h-full flex items-center justify-center p-2 truncate cursor-pointer" style="background-color: ${backgroundColor}; color: ${textColor};" title="${cellContent}" onclick="copyToClipboard('${cellContent}', ${isTailwind})">${cellContent}</div>`;
}

function copyToClipboard(text, isTailwind) {
    navigator.clipboard.writeText(text).then(() => {
        const message = isTailwind 
            ? `${text} copied to the clipboard.`
            : `${text} copied to the clipboard.`;
        showToast(message);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy to clipboard. Please try again.', true);
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'fixed bottom-4 right-4 z-50';
    document.body.appendChild(container);
}

function showToast(message, isError = false) {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `${isError ? 'bg-red-500' : 'bg-green-500'} text-white px-6 py-4 rounded-lg shadow-lg mb-4 transition-opacity duration-300 opacity-0`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // Trigger a reflow to enable the transition
    toast.offsetHeight;

    // Make the toast visible
    toast.classList.remove('opacity-0');

    // Hide the toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
}

function getContrastColor(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black or white depending on luminance
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

function getTailwindColor(className) {
    const colorMap = {
        'bg-white': '#FFFFFF',
        'bg-black': '#000000',
        'bg-gray-100': '#F3F4F6',
        'bg-gray-200': '#E5E7EB',
        'bg-gray-300': '#D1D5DB',
        'bg-gray-400': '#9CA3AF',
        'bg-gray-500': '#6B7280',
        'bg-gray-600': '#4B5563',
        'bg-gray-700': '#374151',
        'bg-gray-800': '#1F2937',
        'bg-gray-900': '#111827',
        'bg-gray-950': '#030712',
        'bg-red-500': '#EF4444',
        'bg-yellow-200': '#FEF08A',
        'bg-yellow-700': '#A16207',
        'bg-green-500': '#10B981',
        'bg-green-700': '#047857',
        'bg-blue-400': '#60A5FA',
        'bg-blue-500': '#3B82F6',
        'bg-blue-600': '#2563EB',
        'bg-blue-700': '#1D4ED8',
        'bg-blue-800': '#1E40AF',
        'bg-blue-900': '#1E3A8A',
        'bg-blue-950': '#172554',
        'bg-pink-500': '#EC4899',
        'bg-pink-700': '#BE185D',
    };
    return colorMap[className] || '#FFFFFF';
}

// Main section data
const mainColorData = [
    { element: "Headers", state: "Normal", lightMode: "#4e7ece", darkMode: "#3a5e9a", lightTailwind: "bg-blue-600", darkTailwind: "bg-blue-800" },
    { element: "Protocol links", state: "Normal", lightMode: "#337ab7", darkMode: "#2c6798", lightTailwind: "bg-blue-700", darkTailwind: "bg-blue-900" },
    { element: "Incidents text color", state: "Normal", lightMode: "#333", darkMode: "#e0e0e0", lightTailwind: "bg-gray-800", darkTailwind: "bg-gray-300" },
    { element: "Selected page", state: "Background", lightMode: "#337ab7", darkMode: "#2c6798", lightTailwind: "bg-blue-700", darkTailwind: "bg-blue-900" },
    { element: "Selected page", state: "Text", lightMode: "#FFFFFF", darkMode: "#FFFFFF", lightTailwind: "bg-white", darkTailwind: "bg-white" },
    { element: "Export button", state: "Background", lightMode: "#8bc34a", darkMode: "#689f38", lightTailwind: "bg-green-500", darkTailwind: "bg-green-700" },
    { element: "Export button", state: "Text", lightMode: "#FFFFFF", darkMode: "#FFFFFF", lightTailwind: "bg-white", darkTailwind: "bg-white" },
    { element: "Open call pop-up", state: "Background", lightMode: "#FFFFFF", darkMode: "#424242", lightTailwind: "bg-white", darkTailwind: "bg-gray-800" },
    { element: "Open call pop-up", state: "Text", lightMode: "#337ab7", darkMode: "#64b5f6", lightTailwind: "bg-blue-700", darkTailwind: "bg-blue-400" },
];

// Side menu section data
const sideMenuColorData = [
    { element: "Active queue", state: "Normal", lightMode: "#ff4081", darkMode: "#c51162", lightTailwind: "bg-pink-500", darkTailwind: "bg-pink-700" },
    { element: "Other queues", state: "Normal", lightMode: "#337ab7", darkMode: "#1c4f7c", lightTailwind: "bg-blue-700", darkTailwind: "bg-blue-900" },
    { element: "Installation text color", state: "Normal", lightMode: "#424242", darkMode: "#e0e0e0", lightTailwind: "bg-gray-800", darkTailwind: "bg-gray-300" },
    { element: "Queue titles", state: "Normal", lightMode: "#62686f", darkMode: "#a0a4a8", lightTailwind: "bg-gray-600", darkTailwind: "bg-gray-400" },
    { element: "Queue count", state: "Normal", lightMode: "#FFFFFF", darkMode: "#121212", lightTailwind: "bg-white", darkTailwind: "bg-gray-900" },
];

// Options Modal section data
const optionsModalColorData = [
    { element: "Qi Macros", state: "Button Background", lightMode: "#8bc34a", darkMode: "#558b2f", lightTailwind: "bg-green-500", darkTailwind: "bg-green-700" },
    { element: "Qi Macros", state: "Text", lightMode: "#FFFFFF", darkMode: "#121212", lightTailwind: "bg-white", darkTailwind: "bg-gray-900" },
    { element: "Load button", state: "Background", lightMode: "#8bc34a", darkMode: "#558b2f", lightTailwind: "bg-green-500", darkTailwind: "bg-green-700" },
    { element: "Load button", state: "Text", lightMode: "#FFFFFF", darkMode: "#121212", lightTailwind: "bg-white", darkTailwind: "bg-gray-900" },
];

// Incident opened section data
const incidentOpenedColorData = [
    { element: "Save, load, edit protocols button", state: "Background", lightMode: "#337ab7", darkMode: "#1c4f7c", lightTailwind: "bg-blue-700", darkTailwind: "bg-blue-900" },
    { element: "Save, load, edit protocols button", state: "Border", lightMode: "#2e6da4", darkMode: "#1a5081", lightTailwind: "bg-blue-800", darkTailwind: "bg-blue-950" },
    { element: "Save, load, edit protocols button", state: "Text", lightMode: "#FFFFFF", darkMode: "#e0e0e0", lightTailwind: "bg-white", darkTailwind: "bg-gray-300" },
    { element: "Test headers", state: "Background", lightMode: "#226A98", darkMode: "#154964", lightTailwind: "bg-blue-800", darkTailwind: "bg-blue-950" },
    { element: "Test headers", state: "Text", lightMode: "#FFFFFF", darkMode: "#e0e0e0", lightTailwind: "bg-white", darkTailwind: "bg-gray-300" },
    { element: "Summary tab", state: "Background", lightMode: "#ff4081", darkMode: "#c51162", lightTailwind: "bg-pink-500", darkTailwind: "bg-pink-700" },
    { element: "History tab", state: "Background", lightMode: "#2196f3", darkMode: "#0d47a1", lightTailwind: "bg-blue-500", darkTailwind: "bg-blue-800" },
    { element: "Headers on summary tab", state: "Text", lightMode: "#337ab7", darkMode: "#64b5f6", lightTailwind: "bg-blue-700", darkTailwind: "bg-blue-400" },
    { element: "Info on summary tab", state: "Text", lightMode: "#424242", darkMode: "#e0e0e0", lightTailwind: "bg-gray-800", darkTailwind: "bg-gray-300" },
    { element: "Headers on history", state: "Text", lightMode: "#333", darkMode: "#e0e0e0", lightTailwind: "bg-gray-800", darkTailwind: "bg-gray-300" },
    { element: "'Review' header tab", state: "Background", lightMode: "#efe4b08f", darkMode: "#8b7d3a8f", lightTailwind: "bg-yellow-200", darkTailwind: "bg-yellow-700" },
    { element: "Incident tab (number)", state: "Background", lightMode: "#b9b9b926", darkMode: "#5a5a5a26", lightTailwind: "bg-gray-200", darkTailwind: "bg-gray-600" },
    { element: "Incident tab (number)", state: "Border bottom", lightMode: "#568ab7", darkMode: "#2c5c8f", lightTailwind: "bg-blue-600", darkTailwind: "bg-blue-800" },
    { element: "Incident tab (number)", state: "Text", lightMode: "#000000", darkMode: "#FFFFFF", lightTailwind: "bg-black", darkTailwind: "bg-white" },
    { element: "Flow section header", state: "Background", lightMode: "#f7f8f9", darkMode: "#2c2c2c", lightTailwind: "bg-gray-100", darkTailwind: "bg-gray-800" },
];

function initializeTables() {
    console.log("Initializing tables");
    createColorTable("Main", mainColorData);
    createColorTable("Side Menu", sideMenuColorData);
    createColorTable("Options Modal", optionsModalColorData);
    createColorTable("Incident Opened", incidentOpenedColorData);
    console.log("Tables initialized");
}

function toggleTailwindColumns() {
    console.log("Toggling Tailwind columns");
    const tailwindColumns = document.querySelectorAll('.tailwind-column');
    const isChecked = document.getElementById('toggleThree').checked;
    
    tailwindColumns.forEach(column => {
        column.style.display = isChecked ? 'table-cell' : 'none';
    });
    console.log(`Tailwind columns ${isChecked ? 'shown' : 'hidden'}`);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM content loaded");
    initializeTables();
    toggleTailwindColumns(); // Initially hide Tailwind columns
    const toggle = document.getElementById('toggleThree');
    if (toggle) {
        toggle.addEventListener('change', toggleTailwindColumns);
        console.log("Toggle event listener added");
    } else {
        console.error("toggleThree not found");
    }
    createToastContainer();
    lucide.createIcons();
});

console.log("Script loaded");