//If you import any files/modules, the main.js file will not run
//Do not define this file as a module

//PUBLIC VARIABLES
const rangeSlider = document.getElementById('range-slider');
const progressBar = document.getElementById('progress-bar');

const rangeValue = document.querySelectorAll('.range-value');

// const 

// Function to update progress bar width based on range slider value
function updateProgressBar() {
    let value = rangeSlider.value;
    
    progressBar.style.width = (value / 60) * 100 + '%';
    //Call update rangeValue
    updateRangeValue(value)
}

function updateRangeValue(value) {
    for(let i = 0; i < rangeValue.length; i++)
    {
        rangeValue[i].textContent = value; 
    }
}

// Add an event listener to detect changes in the range slider value
rangeSlider.addEventListener('input', updateProgressBar);

// Call the function initially to set the initial width based on the default value
updateProgressBar();


