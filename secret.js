const fs = require('fs');


function decodeValue(base, value) {
    let result = 0;
    for (let c of value) {
        result = result * base + (c >= '0' && c <= '9' ? c.charCodeAt(0) - '0'.charCodeAt(0) : c.charCodeAt(0) - 'a'.charCodeAt(0) + 10);
    }
    return result;
}


function lagrangeInterpolation(points) {
    let constantTerm = 0;
    const n = points.length;

    for (let i = 0; i < n; i++) {
        let xi = points[i][0];
        let yi = points[i][1];
        let term = yi;

        for (let j = 0; j < n; j++) {
            if (i !== j) {
                term *= -points[j][0];
                term /= (xi - points[j][0]);
            }
        }

        constantTerm += term;
    }

    return constantTerm;
}


function findConstantTerm(filename) {
    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));

    const n = data.keys.n;
    const k = data.keys.k;

    const points = [];

    for (let key in data) {
        if (!isNaN(key)) {
            const x = parseInt(key);
            const base = parseInt(data[key].base);
            const value = data[key].value;
            const y = decodeValue(base, value);
            points.push([x, y]);
        }
    }


    const selectedPoints = points.slice(0, k);


    return lagrangeInterpolation(selectedPoints);
}

const filename1 = './testcase1.json';
const filename2 = './testcase2.json';

const secret1 = findConstantTerm(filename1);
const secret2 = findConstantTerm(filename2);

console.log(`Secret for testcase 1: ${secret1});
console.log(Secret for testcase 2: ${secret2}`);