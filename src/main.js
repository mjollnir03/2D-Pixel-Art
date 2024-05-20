//If you import any files/modules, the main.js file will not run
//Do not define this file as a module

//PUBLIC VARIABLES
//statements which are giving a variable a DOM object will be declared constant for future clarity
const colorSelect = document.getElementById('color-select'); //the colorSelect variable is the user input for the pen color
const bgColorSelect = document.getElementById('bg-color-select'); //the bgColorSelect variable is the user input for the back ground color

let penColor = colorSelect.value; //the variable will take the value attribute from the colorSelect variable of type HTMLElement
let bgPenColor= bgColorSelect.value; //the variable will take the value attribute from the bgColorSelect variable of type HTMLElement
let mouseDown = false;

const rangeSlider = document.getElementById('range-slider'); //official input slider where we get the size of the grid from the user 
let gridValue = rangeSlider.value; //get value from the actual input slider

const progressBar = document.getElementById('progress-bar'); //progress bar has no real value, instead will be used to visually showcase the size of the grid

const rangeValue = document.querySelectorAll('.range-value'); //this is to display the actual size of the grid

const buttons = document.getElementsByTagName('button');
let colorGRabber = false;
let colorFill = false;
let eraser = false; 
let toggleRainbow = false;
let toggleGrid = false;


let variablesArray = [colorGRabber, colorFill, eraser, toggleRainbow, toggleGrid];

const gridContainer = document.querySelector('.grid-container');

// Function to create the Grid, bases on the gridValue variable
function createGrid() { 
    gridContainer.style.gridTemplateColumns = `repeat(${gridValue}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridValue}, 1fr)`;

    for(let i = 0; i < gridValue ** 2; i++)
    {
        const pixel = document.createElement('div'); 
        pixel.classList.add('grid-item');
        pixel.setAttribute('draggable', 'false');
        pixel.style.backgroundColor = bgPenColor;

        gridContainer.appendChild(pixel);
    }
}

function clearGrid() {
    const gridItems = document.querySelectorAll('.grid-item'); //need to change this so that we don't keep creating a gridItems variable every time

    gridItems.forEach(gridItem => {
        gridItem.classList.remove('changed');
        gridItem.style.backgroundColor = bgPenColor;
        gridItem.classList.add("transition-class");
    })
    setTimeout(function () {
        gridItems.forEach(gridItem => {
            gridItem.classList.remove("transition-class");
        })
    }, 700);
}


function gridLineManipulation() {
    let property = '';
    if(toggleGrid) {
        property = 'solid 1px';
    }

    const gridItems = document.querySelectorAll('.grid-item'); //need to change this so that we don't keep creating a gridItems variable every time

    gridItems.forEach(gridItem => {
        gridItem.style.borderTop = property;
        gridItem.style.borderRight = property;
    })
    
}


//function to convert RGB string to hex string, will be used for color grabber
function rgbToHex(rgbString) {
    // Extract the RGB values
    const rgb = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/); //regular expression to define a rgb
    // Convert each RGB value to hex and concatenate them
    return "#" + ((1 << 24) + (parseInt(rgb[1]) << 16) + (parseInt(rgb[2]) << 8) + parseInt(rgb[3])).toString(16).slice(1); //
}

function handleMouseDown(event) { //main logic may have to implemented here
    // Set the background color of the target element
    event.target.style.backgroundColor = penColor;
    
    // Check if penColor is equal to bgPenColor
    if (penColor === bgPenColor) {
        // If they are equal, remove the 'changed' class from the target element
        event.target.classList.remove('changed');
    } else if(penColor !== bgPenColor) { // Second if statement so that future additions are easier to add
        // Otherwise, add the 'changed' class to the target element
        event.target.classList.add('changed');
    }

    // Set mouseDown to true
    mouseDown = true;
}

function handleMouseUp() { 
    mouseDown = false; 
}

function handleMouseHover(event) {
    if(mouseDown) {
        handleMouseDown(event); //we will handle the main logic in handleMouseDown()
    }
}

function addGridEventListeners() { 
    const gridItems = document.querySelectorAll('.grid-item');

    gridItems.forEach(gridItem => {
        gridItem.addEventListener('mousedown', handleMouseDown);
        gridItem.addEventListener('mouseenter', handleMouseHover);
    });
    
    return;
}

function removeGridEventListeners() { 
    const gridItems = document.querySelectorAll('.grid-item');

    gridItems.forEach(gridItem => {
        gridItem.removeEventListener('mousedown', handleMouseDown);
        gridItem.removeEventListener('mouseenter', handleMouseHover);
    });

    return;
}

// Function to delete all the div elements within the Grid
function deleteGrid() {
    const gridItems = document.querySelectorAll('.grid-item');
    
    // Remove each grid item from the grid container
    gridItems.forEach(gridItem => {
        gridContainer.removeChild(gridItem);
    });
}

function reInitGrid() { //might not have to pass the gridValue, will change later if needed
    updateRangeValue();
    removeGridEventListeners();
    deleteGrid();
    createGrid();
    addGridEventListeners();
    gridLineManipulation();
}


// Function to update progress bar width based on range slider value
function updateProgressBar() {
    gridValue = rangeSlider.value; //get value from the actual input slider
    
    progressBar.style.width = (gridValue / 60) * 100 + '%';
    // Call reInitGrid(), this will call necessary functions to correct grid
    reInitGrid();
}

function updateRangeValue() { //this function updates the range slider values displayed to the users
    for(let i = 0; i < rangeValue.length; i++) //there are two ".range-value" <span> elements so we use a for loop to update them both
    {
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
        //console.log(variablesArray);
    }
}


// EVENT LISTENERS

colorSelect.addEventListener('input', () => {
    penColor = colorSelect.value;
});

bgColorSelect.addEventListener('input', () => { // I will update this so that it will only change the gridItem when the 'changed' class is not present
    bgPenColor = bgColorSelect.value; 
    const gridItems = document.querySelectorAll('.grid-item');

    gridItems.forEach(gridItem => {
        if (!gridItem.classList.contains('changed')) {
            gridItem.style.backgroundColor = bgPenColor;
        }
    });
});


// The function below will also link to call the reInitGrid()
rangeSlider.addEventListener('input', updateProgressBar); //update slider 1 - 60

// BUTTONS 
for(let i = 0; i < 4; i++)
{
    buttons[i].addEventListener('click', () => {
        checkButtons(buttons[i]);
    });
}

buttons[4].addEventListener('click', () => { //toggle grid
    buttons[4].classList.toggle('btn-on');
    toggleGrid = !toggleGrid;
    // toggle grid functionality 

    gridLineManipulation();
    
})

buttons[5].addEventListener('click', () => { //clear grid
    buttons[5].classList.toggle('btn-on');
    
    clearGrid();
    

    setTimeout(function () {
        buttons[5].classList.remove('btn-on');
    }, 700);

    //reInitGrid();
})

// Add mouseup event listener to the entire document
document.addEventListener('mouseup', handleMouseUp);


// FUNCTION CALLS

// Initial Function call to make it that grid is created, and event listeners are added
createGrid();
addGridEventListeners();



