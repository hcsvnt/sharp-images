const fs = require('fs');
const path = require('path');
const { parse } = require('path');

const folder = './input';

console.log("Start.");
// const fileNames = fs.readdirSync(folder);

// fileNames.forEach((fileName) => console.log(fileName));
// console.log("Ready.");


// fs.readdir(folder, (err, fileNames) => {
//     fileNames.forEach((fileName) => console.log(fileName));
//     console.log("Ready.");
// })

// function doStep1(init, callback) {
//     const result = init + 1;
//     console.log(result)
//     callback(result);
// }

// function doStep2(init, callback) {
//     const result = init + 2;
//     console.log(result)
//     callback(result);
// }

// function doStep3(init, callback) {
//     const result = init + 3;
//     console.log(result)
//     callback(result);
// }

// function doOperation() {
//     doStep1(0, (result1) => {
//         doStep2(result1, (result2) => {
//             doStep3(result2, (result3) => {
//             console.log(`result: ${result3}`);
//             });
//         });
//     });

// }

// doOperation();

// function logSync() {
//     console.log('sync')
// }


// async function logStuff(callback) {
//     console.log('none')

//     setTimeout(() => console.log('1000'), 1000)

//     callback()
//     console.log('none again')
// }

// logStuff(() => logSync())



// Execute the function "doThis" with another function as parameter, in this case "andThenThis". doThis will execute whatever code it has and when it finishes it should have "andThenThis" being executed.

// doThis(andThenThis)

// // Inside of "doThis" it's referenced as "callback" which is just a variable that is holding the reference to this function

// function andThenThis() {
//     console.log('and then this')
// }

// // You can name it whatever you want, "callback" is common approach

// function doThis(callback) {
//     // console.log('this first')
//     setTimeout(() => console.log('this first'), 1000)

//   // the '()' is when you are telling your code to execute the function reference else it will just log the reference

//     callback()
// }


// const myPromise = new Promise(function(resolve, reject) {
//     if (codeIsFine = 1) {
//         resolve('fine')
//     } else {
//         reject('error')
//     }
// })

// myPromise
//     .then(function whenOk(response) {
//         console.log(response)
//         return response
//     })
//     .catch(function notOk(err) {
//         console.error(err)
//     })


// sumTwentyAfterTwoSeconds(10)
//     .then(result => console.log('after 2 seconds', result))

// async function sumTwentyAfterTwoSeconds(value) {
//     const remainder = afterTwoSeconds(20)
//     return value + await remainder
// }

// function afterTwoSeconds(value) {
//     return new Promise(resolve => {
//         setTimeout(() => { resolve(value) }, 2000);
//     });
// }

// console.log('End.')





function toppings_choice (){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{

        resolve( console.log("which topping would you love?") )

        },3000)
    })
    }
async function kitchen(){

    console.log("A")
    console.log("B")
    console.log("C")

    await toppings_choice()

    console.log("D")
    console.log("E")

    }

    // Trigger the function

kitchen();
