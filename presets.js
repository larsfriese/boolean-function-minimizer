function Multiplexer4b() {
    // set radio button
    document.querySelector( 'input[name="inlineRadioOptions"]:checked').value = 4;

    // set checkboxes
    for (let i = 0; i < Math.pow(2, 4); i++) {
        var checkedValue = document.getElementById('flexCheckDefault' + dec2bin(i));
        if (i == 5 || i == 13) {
            checkedValue.checked = true;
        }
    }
    checkBox();

    // add textbox
    const tbs = document.getElementById('textboxes');
    tbs.innerHTML = `
    <div class="card text-bg-light mt-2" style="max-width: 18rem;">
        <div class="card-header">Presets</div>
            <div class="card-body">
            <h5 class="card-title">4 bit Multiplexer</h5>
            <p class="card-text">This circuit has 1 as the output if the last three bit (x2, x3, x4) represent the number 5 in binary.</p>
            </div>
        </div>
    </div>`;
}