// https://stackoverflow.com/a/38545750
function char_contains_chars(string, substring) {
    var letters = [...string];
    return [...substring].every(x => {
        var index = letters.indexOf(x);
        if (~index) {
            letters.splice(index, 1);
            return true;
        }
    });
}

function numberInPI(primImpl, number, dim) {

    numberInDecimal = leadingZeros(dec2bin(number), dim);

    for (let i = 0; i < primImpl.length; i++) {
        if (!(numberInDecimal[i] == primImpl[i] || '-' == primImpl[i])) {
            return false;
        }
    }
    return true;
}

function list_with_pi(primImpl, dim) {

    var listOfNumbers = [];
    var listOfPrimImpls = [];

    for (let c = 0; c < Math.pow(2, dim); c++) {
        for (let i = 0; i < primImpl.length; i++) {
            // if number is in prime implicant o
            if (numberInPI(primImpl[i], c, dim)) {
                
                // push numbers to number list 
                if (!(listOfNumbers.includes(c))) {
                    listOfNumbers.push(c);
                    listOfPrimImpls.push([]);
                }

                // push prime implicants to sublist for that number
                if (listOfNumbers.includes(c)) {listOfPrimImpls[listOfNumbers.indexOf(c)].push(i);}
            }
        }
    }

    return [listOfNumbers, listOfPrimImpls];
}

function multiply_out(sum_of_products) {

    var final_list = [];
    for (let i = 0; i < sum_of_products[0].length; i++) {
        for (let e = 0; e < sum_of_products[1].length; e++) {
            var newStr = sum_of_products[0][i] + sum_of_products[1][e];
            final_list.push(newStr);
        }
    }

    // remove first element of orginial list
    sum_of_products = sum_of_products.slice(2);

    // combine the new product and the rest of the list
    return [final_list].concat(sum_of_products);
}

function check_laws(sum_of_products) {

    // check for x*x=x inside the products
    for (let i = 0; i < sum_of_products.length; i++) {
        for (let e = 0; e < sum_of_products[i].length; e++) {
            // sort the chars so its easier later if we want to find duplicstes
            sum_of_products[i][e] = Array.from(new Set(sum_of_products[i][e])).sort().join("");
        }
    }

    // check for x+x=x outside
    // 2 for, length: sum_of_products.length
    var new_sum_of_products = [];
    for (let i = 0; i < sum_of_products.length; i++) {

        // inside of list
        for (let e = 0; e < sum_of_products[i].length; e++) {
            // delete duplicates
            sum_of_products[i] = [...new Set(sum_of_products[i])];
        }


        // outside of list
        for (let e = 0; e < sum_of_products.length; e++) {
            // make new list
            if (!(new_sum_of_products.includes(sum_of_products[i].sort()))) {
                new_sum_of_products.push(sum_of_products[i].sort())
            }
        }
    }

    return new_sum_of_products;
}

function absorption_law(sum_of_products) {

    // put all elements with the smallest length in one list
    var smallest_length = sum_of_products[0][0].length;
    var smallest_list = [];
    for (let i = 0; i < sum_of_products[0].length; i++) {
        if (sum_of_products[0][i].length < smallest_length) {
            smallest_length = sum_of_products[0][i].length;
        }
    }

    // put all elements with the smallest length in one list
    for (let i = 0; i < sum_of_products[0].length; i++) {
        if (sum_of_products[0][i].length == smallest_length) {
            smallest_list.push(sum_of_products[0][i]);
        }
    }

    // check if one of the elements in the smallest list is in the other lists
    // check if all of the charachters from an element in the smallest list are in an element in the other lists
    // if so, delete the element from the other lists
    // example: "LMQ" is an element in the smallest list, "LPRQM" is an element in the other lists
    // "LMQ" is in "LPRQM" so "LPRQM" is deleted from the other lists
    var new_sum_of_products = [];
    for (let e = 0; e < sum_of_products[0].length; e++) {
        found = 0;
        for (let i = 0; i < smallest_list.length; i++) {
            if (!(char_contains_chars(sum_of_products[0][e], smallest_list[i]))) {
                found += 1
            }
        }
        if (found == smallest_list.length) {new_sum_of_products.push(sum_of_products[0][e]);}
    }

    // push all elements from smallest list to new list
    for (let i = 0; i < smallest_list.length; i++) {
        new_sum_of_products.push(smallest_list[i]);
    }

    return new_sum_of_products;
}

// https://en.wikipedia.org/wiki/Petrick's_method
function PetricksMethod(primeImplicantList) {

    var sum_of_products = [];
    lists = list_with_pi(primeImplicantList, primeImplicantList[0].length);
    for (let i = 0; i < lists[0].length; i++) {
        var temp = [];
        for (let e = 0; e < lists[1][i].length; e++) {
            // for the number get the letter for that number in ascii
            // and append the letter as a string to the temp list
            temp.push(String.fromCharCode(lists[1][i][e] + 65));        
        }
        // add the temp list to the sum of products list
        sum_of_products.push(temp);
    }

    console.log(sum_of_products);
    // var sum_of_products = [["K", "L"], ["K", "M"], ["L", "N"], ["M", "P"], ["N", "Q"], ["P", "Q"]];

    // multiply out the sum of products and apply the rules of:
    // 1. x*x=x
    // 2. x+x=x
    while (sum_of_products.length != 1) {
        sum_of_products = multiply_out(sum_of_products);
        sum_of_products = check_laws(sum_of_products);
    }

    // apply the absorption law: x+xy=x
    sum_of_products = absorption_law(sum_of_products);
    
    // find length of smallest element
    for (let i = 0; i < sum_of_products.length; i++) {
        var smallest = sum_of_products[i].length;
        if (sum_of_products[i].length < smallest) {
            smallest = sum_of_products[i].length;
        }
    }
    
    // find all smallest elements
    var smallest_list = [];
    for (let i = 0; i < sum_of_products.length; i++) {
        if (sum_of_products[i].length == smallest) {
            smallest_list.push(sum_of_products[i]);
        }
    }

    // convert the smallest list of elements to the prime implicant list
    list_of_smalles_pis = [];
    for (let i = 0; i < smallest_list.length; i++) {
        list_of_smalles_pis.push([]);

        for (let e = 0; e < smallest_list[i].length; e++) {

            // convert string to number in ascii
            var number_of_PI = smallest_list[i][e].charCodeAt(0) - 65;
            
            // now take number as index in primeImplicantList
            list_of_smalles_pis[i].push(primeImplicantList[number_of_PI]);
        }
    }

    // now convert them all to a string, which is the final boolean function
    for (let i = 0; i < list_of_smalles_pis.length; i++) {
        list_of_smalles_pis[i] = primImpl_to_SchaltFunk(list_of_smalles_pis[i]);
    }

    return list_of_smalles_pis;

}

