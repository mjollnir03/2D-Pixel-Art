//If you import any files/modules, the main.js file will not run
//Do not define this file as a module

//PUBLIC VARIABLES
const colorSelect = document.getElementById('color-select');
const bgColorSelect = document.getElementById('bg-color-select');

let gridValue = 25;
let penColor = '#000000';
let bgPenColor= '#ffffff';

const rangeSlider = document.getElementById('range-slider');
const progressBar = document.getElementById('progress-bar');

const rangeValue = document.querySelectorAll('.range-value');

const buttons = document.getElementsByTagName('button');
let buttonsTF_1_4 = [false, false, false, false];
let toggleGrid = false;
let clearGrid = false;

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

// Function to delete all the div elements within the Grid
function deleteGrid() {
    const gridItems = document.querySelectorAll('.grid-item');
    
    // Remove each grid item from the grid container
    gridItems.forEach(gridItem => {
        gridContainer.removeChild(gridItem);
    });
}

function reInitGrid() {
    createGrid();
    //should add method to add event listeners
}


// Function to update progress bar width based on range slider value
function updateProgressBar() {
    gridValue = rangeSlider.value; //get value from the actual input slider
    
    progressBar.style.width = (gridValue / 60) * 100 + '%';
    //Call update rangeValue
    updateRangeValue(gridValue);
    //method to remove all event listeners here
    deleteGrid();
    reInitGrid();
}

function updateRangeValue(value) { //this function updates the range slider values displayed to the users
    for(let i = 0; i < rangeValue.length; i++) //there are two ".range-value" <span> elements so we use a for loop to update them both
    {
        rangeValue[i].textContent = value; 
    }
}

function checkButtons(buttonId) {
    for (let i = 0; i < 4; i++) {
      if (buttons[i] === buttonId) {
        // Toggle the class for the clicked button
        buttons[i].classList.toggle('btn-on');
      } else {
        // Remove the class for other buttons
        buttons[i].classList.remove('btn-on');
      }
    }
  }


// EVENT LISTENERS

colorSelect.addEventListener('input', () => {
    penColor = colorSelect.value;
});

bgColorSelect.addEventListener('input', () => {
    bgPenColor = bgColorSelect.value;
});

// The function below will also link to call the reInitGrid()
rangeSlider.addEventListener('input', updateProgressBar); //update slider 1 - 60

//BUTTONS {brute force}
for(let i = 0; i < 4; i++)
{
    buttons[i].addEventListener('click', () => {
        checkButtons(buttons[i]);

    });
}
buttons[4].addEventListener('click', () => { //toggle grid
    buttons[4].classList.toggle('btn-on');
    //need to add toggle grid function later
})
buttons[5].addEventListener('click', () => { //clear grid
    buttons[5].classList.toggle('btn-on');
    //need to add clear grid function later on
})


// FUNCTION CALLS
// Call the function initially to set the initial width based on the default value
updateProgressBar();



