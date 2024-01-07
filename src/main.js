//If you import any files/modules, the main.js file will not run
//Do not define this file as a module

//PUBLIC VARIABLES
const colorSelect = document.getElementById('color-select');
const bgColorSelect = document.getElementById('bg-color-select');

let gridValue;
let penColor;
let bgPenColor;
const rangeSlider = document.getElementById('range-slider');
const progressBar = document.getElementById('progress-bar');

const rangeValue = document.querySelectorAll('.range-value');

const buttons = document.getElementsByTagName('button');
let buttons_tf = [false, false, false, false, false, false];




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


