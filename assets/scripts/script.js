// Get current year and display as copyright year in footer
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
document.getElementById("copyright").innerText = currentYear;
