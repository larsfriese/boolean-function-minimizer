// get permutations for a list, no duplicate elements and order doesnt matter
// found here: https://stackoverflow.com/a/62854671
function getPermutationsWD(array, length) {
    return array.flatMap((v, i) => length > 1
        ? getPermutationsWD(array.slice(i + 1), length - 1).map(w => [v, ...w])
        : [[v]]
    );
}

// replaces charachters at a given index in a string
String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

// returns the indices at which multiple strings are not equal
// as well as a string with dashes where the strings are not euqal
function equalBut(list_strs) {
    const list_of_ind = [];
    let last_str = list_strs[0];

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
                // only push to list if its not already there
                if (!list_of_ind.includes(ind)) {
                    list_of_ind.push(ind);
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
    return [list_of_ind, list_strsCopy[0]];
}

// implements the Quine–McCluskey algorithm
// searches for prime-implicants in a given list 'ones'
function findUnterwürfel(ones, diffChars) {

    // fill 'taken' with zeros with length of 'ones'
    const taken = new Array(ones.length).fill(0)

    // if n-cubes cant be found: remaining strings are prime implicants
    if (2*diffChars > ones.length) {
        for (let i = 0; i < ones.length; i++) {
            primImpl.push(ones[i]);
        }
        ones.length = 0;

        // loop can then be ended here
        return;
    }

    var res = getPermutationsWD(ones, 2*diffChars);

    for (let i = 0; i < res.length; i++) {

        // calc how many chars different
        let int_list = equalBut(res[i]);

        if (int_list[0].length == diffChars) {
            
            // find index of elements of res in ones
            // and tick in taken
            for (let res_i = 0; res_i < res[i].length; res_i++) {
                taken[ones.indexOf(res[i][res_i])] = 1;
            }

            // only add to list if not there
            if (!next.includes(int_list[1])) {next.push(int_list[1]);}
        }
    }

    // add rest of numbers to prime implicant list
    for (let i = 0; i < ones.length; i++) {
        if (taken[i] == 0) {
            primImpl.push(ones[i]);
        }
    }

    // reset the lists (ones empty, copy next to ones)
    ones.length = 0;
    Array.prototype.push.apply(ones, next);
    next.length = 0;

    return;
}

// converts list of prime implicants to a string that represents the switch function (schaltfunktion)
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

const primImpl = [];
const taken = [];
const next = [];

// searches for all prime implicants and prints the switch function
// given a list of binary values that return 1 using that switch function
function main(ones) {
    number = 0;
    primImpl.length = 0;
    taken.length = 0;
    next.length = 0;

    while (ones.length != 0) {
        let n_power = Math.pow(2, number)
        findUnterwürfel(ones, n_power);
        number += 1;
    }

    // update the formula
    document.getElementById("Schaltfunktion").innerHTML = "$ " + primImpl_to_SchaltFunk(primImpl) + " $";
    MathJax.typeset(["#Schaltfunktion"]);

    return primImpl;
}

