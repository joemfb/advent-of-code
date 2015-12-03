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
  }
  return floor
}

console.log('solution:')
console.log('    ' + walk(input))
