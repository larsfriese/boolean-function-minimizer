# boolean-function-minimizer

App: https://larsfriese.github.io/boolean-function-minimizer/

#### Notes about this:

#### Prime Implicant table:

My first idea to finding overlaping prime implicants in the table was to first find the essential prime implicants which
is easy and then make all possible combinations of the rest of prime implicants and find the best combinations from
there. I quickly realized this is far from efficient and searched for already exsisting algorithms.
Petricks Methods exists and I thought I could implement it using an equation solver/simplifier. Turns out simplifying
equations in the computer is way harder than I thought it would be. So I tried using lists to represent the sum of products
that appear in patricks method. After a bit of fiddling with the code that turned out to work.