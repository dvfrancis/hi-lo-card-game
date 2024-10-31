/**
 * Keep copyright year current, in each page footer
 */
function updateCopyrightYear() {
    let dateNow = new Date();
    let yearNow = dateNow.getFullYear();
    document.getElementById("copyright").innerHTML = ` ${yearNow} `;
}

updateCopyrightYear();