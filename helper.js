var CURRENT_BITS = 3;
var CURRENT_FORMULA = "";

// turns a decimal number into a string of binary numbers
function dec2bin(dec) {
    return (dec >>> 0).toString(2);
}

// adds leading zeros to a string of a binary number
function leadingZeros(bin, paddingSize) {
    return bin.padStart(paddingSize, '0');
}

// replaces charachters at a given index in a string
String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

// converts list of prime implicants to a string that represents the boolean function
function primImpl_to_SchaltFunk(primImpl) {
    finalString = "";

    for (let i = 0; i < primImpl.length; i++) {
        for (let e = 0; e < primImpl[i].length; e++) {
            if (primImpl[i][e] == '1') {
                finalString += 'x_' + (primImpl[i].length - e - 1).toString();
            }
            else if (primImpl[i][e] == '0') {
                finalString += 'x_' + (primImpl[i].length - e - 1).toString() + "'";
            }
            else {
                finalString += '';
            }
        }
        if (i != primImpl.length - 1) {finalString += ' + ';}
    }
    return finalString;
}

// function is called when a number of bits for the switch function have been selected
function dimSelected(bits) {
    CURRENT_BITS = bits;
    let str = "";

    const button = document.getElementById('number_of_bits');
    button.innerHTML = "Number of Bits (" + CURRENT_BITS.toString() + ")";

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

    for (let i = 0; i < Math.pow(2, bits); i++) {
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

// this function gets called everytime a box gets checked
function checkBox() {
    var ones = [];
    var ticked = [];
    
    // check if the checkboxes are checked and add the binary values to a list
    for (let i = 0; i < Math.pow(2, CURRENT_BITS); i++) {
        var checkedValue = document.getElementById('flexCheckDefault' + dec2bin(i));
        if (checkedValue.checked) {
            ones.push(leadingZeros(checkedValue.value, CURRENT_BITS));
            ticked.push("class='bg-success'");
        } else {
            ticked.push("");
        }
    }

    // if all or no boxes are checked
    if (ones.length == Math.pow(2, CURRENT_BITS)) {
        document.getElementById("Schaltfunktion").innerHTML = "$ f(x) = 1 $";
        MathJax.typeset(["#Schaltfunktion"]);
        return;
    } else if (ones.length == 0) {
        document.getElementById("Schaltfunktion").innerHTML = "$ f(x) = 0 $";
        MathJax.typeset(["#Schaltfunktion"]);
        return;
    }

    // find prime implicants
    var primImpl = QuineMcCluskey(ones, CURRENT_BITS);

    // set formula in html and reload mathjax
    document.getElementById("Schaltfunktion").innerHTML = "$ f(x) = " + primImpl_to_SchaltFunk(primImpl) + " $";
    MathJax.typeset(["#Schaltfunktion"]);

    // find minimal expressions
    var minimial_functions = PetricksMethod(primImpl);

    // for clipbard later
    CURRENT_FORMULA = minimial_functions[0];

    // add minimal expressions and refresh MathJax
    if (minimial_functions.length == 1) {
        document.getElementById("Schaltfunktion").innerHTML += "<h6 class='card-subtitle mb-2 text-muted'><br>Minimal Expression:<br></h6>";
    } else {
        document.getElementById("Schaltfunktion").innerHTML += "<h6 class='card-subtitle mb-2 text-muted'><br>Minimal Expressions:<br></h6>";
    }
    for (let i = 0; i < minimial_functions.length; i++) {
        document.getElementById("Schaltfunktion").innerHTML += "$ f(x) = " + minimial_functions[i] + " $<br>";
    }
    MathJax.typeset(["#Schaltfunktion"]);

    // create KV diagramm for 4bit input
    if (CURRENT_BITS == 4) {
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
    } else {
        const table = document.getElementById('kv_table');
        table.innerHTML = "";
    }

}

// on window load select number of bits so table appears
window.addEventListener("load", (event) => {
    dimSelected(3);
  });

// copy to clipboard
function copy_to_clip() {
    navigator.clipboard.writeText(CURRENT_FORMULA);
}