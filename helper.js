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
    
    for (let i = 0; i < Math.pow(2, dimValue); i++) {
        var checkedValue = document.getElementById('flexCheckDefault' + dec2bin(i));
        if (checkedValue.checked) {
            ones.push(leadingZeros(checkedValue.value, dimValue));
        }
    }

    main(ones);
}

// on window load select number of bits so table appears
window.addEventListener("load", (event) => {
    dimSelected();
    checkBox();
  });