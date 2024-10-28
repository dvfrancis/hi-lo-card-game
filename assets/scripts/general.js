/**
 * Keep copyright year current, in the footer
 */
function updateCopyrightYear() {
    let dateNow = new Date();
    let yearNow = dateNow.getFullYear();
    document.getElementById("copyright").innerHTML = ` ${yearNow} `;
}

updateCopyrightYear();

module.exports = {updateCopyrightYear};