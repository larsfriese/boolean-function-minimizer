// turns a decimal number into a string of binary numbers
function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}

// adds leading zeros to a string of a binary number
function leadingZeros(bin, paddingSize) {
    return bin.padStart(paddingSize, '0');
}

// function is called when a number of bits for the switch function have been selected
function dimSelected() {
    var dimValue = document.querySelector( 'input[name="inlineRadioOptions"]:checked').value;
    let str = "";

    const table = document.getElementById('table');
    str = `
    <table class="table table-bordered">
        <thead>
            <tr>
                <th scope="col">Decimal</th>
                <th scope="col">Binary</th>
                <th scope="col">1</th>
            </tr>
        </thead>
        <tbody>`;

    for (let i = 0; i < Math.pow(2, dimValue); i++) {
        str += `
        <tr>
            <th scope="row">` + i + `</th>
            <td>` + dec2bin(i) + `</td>
            <td>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="` + dec2bin(i) + `" id="flexCheckDefault` +  dec2bin(i) + `" onclick="checkBox()">
                </div>
            </td>
        </tr>`;
    }

    str += `</tbody></table>`;
    table.innerHTML = str;
}

function checkBox() {
    var dimValue = document.querySelector( 'input[name="inlineRadioOptions"]:checked').value;
    var ones = [];
    var ticked = [];
    
    for (let i = 0; i < Math.pow(2, dimValue); i++) {
        var checkedValue = document.getElementById('flexCheckDefault' + dec2bin(i));
        if (checkedValue.checked) {
            ones.push(leadingZeros(checkedValue.value, dimValue));
            ticked.push("class='table-danger'");
        } else {
            ticked.push("");
        }
    }

    // find prime implicants
    var primImpl = main(ones);

    // find minimal expressions
    var minimial_functions = PetricksMethod(primImpl);

    // add minimal expressions and refresh MathJax
    document.getElementById("Schaltfunktion").innerHTML += "<h6 class='card-subtitle mb-2 text-muted'><br>Minimal Expression:<br></h6> $ " + minimial_functions[0] + " $";
    MathJax.typeset(["#Schaltfunktion"]);


    if (dimValue == 4) {
        let str = "";
        const table = document.getElementById('kv_table');
        
        str = `
        <table class="table table-bordered" style="width: auto;">
            <thead>
            <tr>
                <th scope="col">KV</th>
                <th scope="col">00</th>
                <th scope="col">01</th>
                <th scope="col">10</th>
                <th scope="col">11</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <th scope="row">00</th>
                <td ` + ticked[0]  + `>0</td>
                <td ` + ticked[1]  + `>1</td>
                <td ` + ticked[3]  + `>3</td>
                <td ` + ticked[2]  + `>2</td>
            </tr>
            <tr>
                <th scope="row">01</th>
                <td ` + ticked[4]  + `>4</td>
                <td ` + ticked[5]  + `>5</td>
                <td ` + ticked[7]  + `>7</td>
                <td ` + ticked[6]  + `>6</td>
            </tr>
            <tr>
                <th scope="row">10</th>
                <td ` + ticked[12]  + `>C</td>
                <td ` + ticked[13]  + `>D</td>
                <td ` + ticked[15]  + `>F</td>
                <td ` + ticked[14]  + `>E</td>
            </tr>
            <tr>
                <th scope="row">11</th>
                <td ` + ticked[8]  + `>8</td>
                <td ` + ticked[9]  + `>9</td>
                <td ` + ticked[11]  + `>B</td>
                <td ` + ticked[10]  + `>A</td>
            </tr>
            </tbody>
        </table>
        `;
        table.innerHTML = str;
    }

}

// on window load select number of bits so table appears
window.addEventListener("load", (event) => {
    dimSelected();
  });