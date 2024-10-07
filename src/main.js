// If you import any files/modules, the main.js file will not run
// Do not define this file as a module

// PUBLIC VARIABLES
// statements which are giving a variable a DOM object will be declared constant for future clarity
const colorSelect = document.getElementById('color-select'); // the colorSelect variable is the user input for the pen color
const bgColorSelect = document.getElementById('bg-color-select'); // the bgColorSelect variable is the user input for the back ground color

let penColor = colorSelect.value; // the variable will take the value attribute from the colorSelect variable of type HTMLElement
let bgPenColor = bgColorSelect.value; // the variable will take the value attribute from the bgColorSelect variable of type HTMLElement
let isDrawing = false;

const rangeSlider = document.getElementById('range-slider'); // official input slider where we get the size of the grid from the user 
let gridValue = rangeSlider.value; // get value from the actual input slider

const progressBar = document.getElementById('progress-bar'); // progress bar has no real value, instead will be used to visually showcase the size of the grid

const rangeValue = document.querySelectorAll('.range-value'); // this is to display the actual size of the grid

const buttons = document.getElementsByTagName('button');
let colorGrabber = false;
let colorFill = false;
let eraser = false;
let toggleRainbow = false;
let toggleGrid = true;

let variablesArray = [colorGrabber, colorFill, eraser, toggleRainbow];

const rainbowColors = [ // found at https://colorkit.co/palette/ffadad-ffd6a5-fdffb6-caffbf-9bf6ff-a0c4ff-bdb2ff-ffc6ff/
    '#ffadad', // Apricot Haze
    '#ffd6a5', // Tuscan
    '#fdffb6', // Parchment
    '#caffbf', // Frosted Mint Hills
    '#9bf6ff', // Eternal Winter
    '#a0c4ff', // Pastel Blue
    '#bdb2ff', // Purple Illusion
    '#ffc6ff'  // Sugar Chic
];

const gridContainer = document.querySelector('.grid-container');

// Function to create the Grid, based on the gridValue variable
function createGrid() { 
    gridContainer.style.gridTemplateColumns = `repeat(${gridValue}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridValue}, 1fr)`;

    for(let i = 0; i < gridValue ** 2; i++) {
        const pixel = document.createElement('div'); 
        pixel.classList.add('grid-item');
        pixel.setAttribute('draggable', 'false');
        pixel.style.backgroundColor = bgPenColor;

        gridContainer.appendChild(pixel);
    }
}

function clearGrid() {
    const gridItems = document.querySelectorAll('.grid-item');
    gridContainer.style.pointerEvents = 'none';
    gridItems.forEach(gridItem => {
        gridItem.classList.remove('changed');
        gridItem.style.backgroundColor = bgPenColor;
        gridItem.classList.add("transition-class");
    });
    
    setTimeout(() => {
        gridItems.forEach(gridItem => {
            gridItem.classList.remove("transition-class");
        });
        gridContainer.style.pointerEvents = 'auto';
    }, 700);
}

function gridLineManipulation() {
    let property = '';
    if(toggleGrid) {
        property = 'solid 1px';
    }

    const gridItems = document.querySelectorAll('.grid-item');

    gridItems.forEach(gridItem => {
        gridItem.style.borderTop = property;
        gridItem.style.borderRight = property;
    });
}

// function to convert RGB string to hex string, will be used for color grabber
function rgbToHex(rgbString) {
    // Extract the RGB values
    const rgb = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    // Convert each RGB value to hex and concatenate them
    return "#" + ((1 << 24) + (parseInt(rgb[1]) << 16) + (parseInt(rgb[2]) << 8) + parseInt(rgb[3])).toString(16).slice(1);
}

function handleStart(event) {
    event.preventDefault();
    isDrawing = true;
    if (event.type === 'touchstart') {
        const touch = event.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        handlePixelInteraction(target);
    } else {
        handlePixelInteraction(event.target);
    }
}

function handleMove(event) {
    if (!isDrawing) return;
    event.preventDefault();
    if (event.type === 'touchmove') {
        const touch = event.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        handlePixelInteraction(target);
    } else {
        handlePixelInteraction(event.target);
    }
}

function handleEnd() {
    isDrawing = false;
}

function handlePixelInteraction(pixel) {
    if (!pixel || !pixel.classList.contains('grid-item')) return;

    if (colorGrabber) {
        const rgbColor = window.getComputedStyle(pixel).backgroundColor;
        const hexColor = rgbToHex(rgbColor);
        penColor = hexColor;
        colorSelect.value = hexColor;
        return;
    }

    pixel.style.backgroundColor = eraser ? bgPenColor : (toggleRainbow ? rainbowColors[Math.floor(Math.random() * rainbowColors.length)] : penColor);

    if (eraser || penColor === bgPenColor) {
        pixel.classList.remove('changed');
    } else {
        pixel.classList.add('changed');
    }

    if (colorFill) {
        fillGrid();
    }
}

function fillGrid() {
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(gridItem => {
        gridItem.style.backgroundColor = penColor;
        if (penColor === bgPenColor) {
            gridItem.classList.remove('changed');
        } else {
            gridItem.classList.add('changed');
        }
    });
}

function addGridEventListeners() { 
    const gridItems = document.querySelectorAll('.grid-item');

    gridItems.forEach(gridItem => {
        gridItem.addEventListener('mousedown', handleStart);
        gridItem.addEventListener('mousemove', handleMove);
        gridItem.addEventListener('touchstart', handleStart);
        gridItem.addEventListener('touchmove', handleMove);
    });
}

function removeGridEventListeners() { 
    const gridItems = document.querySelectorAll('.grid-item');

    gridItems.forEach(gridItem => {
        gridItem.removeEventListener('mousedown', handleStart);
        gridItem.removeEventListener('mousemove', handleMove);
        gridItem.removeEventListener('touchstart', handleStart);
        gridItem.removeEventListener('touchmove', handleMove);
    });
}

// Function to delete all the div elements within the Grid
function deleteGrid() {
    const gridItems = document.querySelectorAll('.grid-item');
    
    // Remove each grid item from the grid container
    gridItems.forEach(gridItem => {
        gridContainer.removeChild(gridItem);
    });
}

function reInitGrid() {
    updateRangeValue();
    removeGridEventListeners();
    deleteGrid();
    createGrid();
    addGridEventListeners();
    gridLineManipulation();
}

// Function to update progress bar width based on range slider value
function updateProgressBar() {
    gridValue = rangeSlider.value; // get value from the actual input slider
    
    progressBar.style.width = (gridValue / 60) * 100 + '%';
    // Call reInitGrid(), this will call necessary functions to correct grid
    reInitGrid();
}

function updateRangeValue() {
    for(let i = 0; i < rangeValue.length; i++) {
        rangeValue[i].textContent = gridValue; 
    }
}

function checkButtons(buttonId) {
    for (let i = 0; i < 4; i++) {
        if (buttons[i] === buttonId) {
            // Toggle the class for the clicked button
            buttons[i].classList.toggle('btn-on');
            variablesArray[i] = !variablesArray[i];
        } else {
            // Remove the class for other buttons
            buttons[i].classList.remove('btn-on');
            variablesArray[i] = false;
        }
    }
    [colorGrabber, colorFill, eraser, toggleRainbow] = variablesArray;
}

function updateBackgroundColor() {
    bgPenColor = bgColorSelect.value;
    const gridItems = document.querySelectorAll('.grid-item');

    gridItems.forEach(gridItem => {
        if (!gridItem.classList.contains('changed')) {
            gridItem.style.backgroundColor = bgPenColor;
        }
    });
}

// EVENT LISTENERS

colorSelect.addEventListener('input', () => {
    penColor = colorSelect.value;
});

bgColorSelect.addEventListener('input', updateBackgroundColor);

// The function below will also link to call the reInitGrid()
rangeSlider.addEventListener('input', updateProgressBar); // update slider 1 - 60

// BUTTONS 
for(let i = 0; i < 4; i++) {
    buttons[i].addEventListener('click', () => {
        checkButtons(buttons[i]);
    });
}

buttons[4].addEventListener('click', () => { // toggle grid
    buttons[4].classList.toggle('btn-on');
    toggleGrid = !toggleGrid;
    // toggle grid functionality 

    gridLineManipulation();
});

buttons[5].addEventListener('click', () => { // clear grid
    buttons[5].classList.toggle('btn-on');
    
    clearGrid();

    setTimeout(function () {
        buttons[5].classList.remove('btn-on');
    }, 700);
});

// Add mouseup and touchend event listeners to the entire document
document.addEventListener('mouseup', handleEnd);
document.addEventListener('touchend', handleEnd);

// Initial Function calls 
createGrid(); 
addGridEventListeners();
gridLineManipulation();