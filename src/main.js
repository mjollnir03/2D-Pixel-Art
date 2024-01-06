//If you import any files/modules, the main.js file will not run
//Do not define this file as a module

//PUBLIC VARIABLES
let gridValue;
const rangeSlider = document.getElementById('range-slider');
const progressBar = document.getElementById('progress-bar');

const rangeValue = document.querySelectorAll('.range-value');

const buttons = document.getElementsByTagName('button');

const clearButton = document.getElementById('clear-grid'); //special case

// Function to update progress bar width based on range slider value
function updateProgressBar() {
    gridValue = rangeSlider.value;
    
    progressBar.style.width = (gridValue / 60) * 100 + '%';
    //Call update rangeValue
    updateRangeValue(gridValue);
}

function updateRangeValue(value) {
    for(let i = 0; i < rangeValue.length; i++)
    {
        rangeValue[i].textContent = value; 
    }
}

function clearGrid(){

}


// EVENT LISTENERS
// Add an event listener to detect changes in the range slider value
rangeSlider.addEventListener('input', updateProgressBar);
for(let i = 0; i < buttons.length; i++)
{
    buttons[i].addEventListener('click', () => {buttons[i].classList.toggle('btn-on')});
}

clearButton.addEventListener('click', );





// FUNCTION CALLS
// Call the function initially to set the initial width based on the default value
updateProgressBar();


