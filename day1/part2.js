var fs = require('fs')

input = fs.readFileSync('./input', 'utf-8')

function walk(input) {
  var floor = 0
  for (var i = 0; i < input.length; i++) {
    if (input[i] === '(') {
      ++floor
    } else if (input[i] === ')') {
      --floor
    }
    if (floor < 0) {
      return i + 1;
    }
  }
}

console.log('solution:')
console.log('    ' + walk(input))
