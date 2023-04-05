// returns the indices at which multiple strings are not equal
// as well as a string with dashes where the strings are not euqal
function equalBut(list_strs) {
    const list_of_ind = [];
    let last_str = list_strs[0];
    var list_of_ind_dashes = [];

    list_strsCopy = [];

    for (i = 0; i < list_strs.length; i++) {
        list_strsCopy[i] = list_strs[i];
    }

    // for every word
    for (let i = 1; i < list_strsCopy.length; i++) {

        // for every letter in word
        for (let ind = 0; ind < list_strsCopy[i].length; ind++) {

            // if the character from last word at indice ind is not the same from this word
            if (list_strsCopy[i][ind] != last_str[ind]) {

                // if one of them dashes
                if (list_strsCopy[i][ind] == "-" || last_str[ind] == "-") {
                    if (!list_of_ind_dashes.includes(ind)) {
                        list_of_ind_dashes.push(ind);
                    }
                } else {
                    // only push to list if its not already there
                    if (!list_of_ind.includes(ind)) {
                        list_of_ind.push(ind);
                    }
                }
            }
            
        }
        // this str is the new last str
        last_str = list_strsCopy[i];
    }
    
    // replace the common chars with dashes
    for (let i = 0; i < list_of_ind.length; i++) {
        list_strsCopy[0] = list_strsCopy[0].replaceAt(list_of_ind[i], "-");
    }

    // return the list of indecis and the string with the dashes
    return [list_of_ind, list_of_ind_dashes, list_strsCopy[0]];
}

function implicants(grouped, bits, current_it) {

    var next_grouped = [];
    var taken_grouped = [];
    var prime_implicants = [];

    // fill the two lists with empty sublists
    for (let i = 0; i <= bits; i++) {
        next_grouped.push([]);
        taken_grouped.push([]);
    }

    // end condition
    var counter = 0;
    var last_implicants = [];
    for (let i = 0; i < grouped.length; i++) {
            if (grouped[i].length == 0) {counter += 1;}
            else (last_implicants = last_implicants.concat(grouped[i]))
    }

    if (counter == bits) {
        return [next_grouped, last_implicants];
    }

    // taken list
    for (let i = 0; i < grouped.length; i++) {
        for (let j = 0; j < grouped[i].length; j++) {
            taken_grouped[i].push(0);
        }
    }

    // check for implicants two groups at the time
    for (let i = 0; i < bits; i++) {
        for (let j = 0; j < grouped[i].length; j++) {
            for (let k = 0; k < grouped[i+1].length; k++) {

                result = equalBut([grouped[i][j], grouped[i+1][k]]);
                
                // if only non dashes symbols equal in string
                if (result[1] != 0) {continue;}
                
                // if one number different to first string
                if (result[0].length == 1) {

                    // tick taken prime implicants
                    taken_grouped[i][j] = 1;
                    taken_grouped[i+1][k] = 1;
                    if (!(next_grouped[i].includes(result[2]))) {
                        next_grouped[i].push(result[2]);
                    }

                }

            }
        }
    }

    // compare grouped and next grouped to find taken prime implicants
    for (let i = 0; i < taken_grouped.length; i++) {
        for (let j = 0; j < taken_grouped[i].length; j++) {
            if (taken_grouped[i][j] == 0) {
                if (!(prime_implicants.includes(grouped[i][j]))) {prime_implicants.push(grouped[i][j]);}
            }
        }
    }

    return [next_grouped, prime_implicants];
}

// https://en.wikipedia.org/wiki/Quine%E2%80%93McCluskey_algorithm
function QuineMcCluskey(ones, bits) {
    var grouped = [];
    var prime_implicants = [];

    // fill the two lists with empty sublists
    for (let i = 0; i <= bits; i++) {
        grouped.push([]);
    }

    // group binary representations
    for (let i = 0; i < ones.length; i++) {

        // number of zeros in binary number
        console.log(ones[i]);
        var number_of_ones = ones[i].toString().replace(/[^1]/g, "").length;

        // sort number into grouped list
        grouped[number_of_ones].push(ones[i].toString());
    }
    
    var number_of_iteration = 1;

    // condition checks if all lists in grouped are empty
    cond = false;
    for (let i = 0; i < grouped.length; i++) {
        if (grouped[i].length != 0) {cond = true;}
    }

    while (cond) {
        results = implicants(grouped, bits, number_of_iteration);
        grouped = results[0];
        prime_implicants = prime_implicants.concat(results[1]);
        number_of_iteration += 1;
        //console.log("after");
        //console.log(results);
        var counter = 0;
        for (let i = 0; i < grouped.length; i++) {
            if (grouped[i].length == 0) {counter += 1;}
        }
        if (counter == grouped.length) {cond = false;}
        // if (number_of_iteration == 4) {throw new Error();}
    }

    return prime_implicants;
}

/*
console.log("Results: ");
console.log(QuineMcCluskey([4,8,9,10,11,12,14,15], 4)); // numbers in binary

// Should return: [ "-100", "10--", "1--0", "1-1-" ]
*/
