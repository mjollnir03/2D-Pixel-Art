//If you import any files/modules, the main.js file will not run
//Do not define this file as a module


let rangeSlider = document.getElementById('range-slider');
let progressBar = document.getElementById('progress-bar');

// Function to update progress bar width based on range slider value
function updateProgressBar() {
    let value = rangeSlider.value;
    progressBar.style.width = (value / 60) * 100 + '%';
}

// Add an event listener to detect changes in the range slider value
rangeSlider.addEventListener('input', updateProgressBar);

// Call the function initially to set the initial width based on the default value
updateProgressBar();



// const container = document.getElementById("he")
// container.style.backgroundColor = "red";

