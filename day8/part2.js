var fs = require('fs')

var input = fs.readFileSync(__dirname + '/input', 'utf-8')

function encodeInput(strings) {
  return strings.map(function(line) {
    var encoded = JSON.stringify(line)

    return {
      input: line,
      encoded: encoded,
      rawLength: line.length,
      encodedLength: encoded.length
    }
  })
}

function calculateDifference(encoded) {
  return encoded.reduce(function(a, b) {
    return a + (b.encodedLength - b.rawLength)
  }, 0)
}

function test() {
  return [
    calculateDifference(encodeInput([
      '""',
      '"abc"',
      '"aaa\\"aaa"',
      '"\\x27"'
    ])) === 19
  ]
  .reduce(function(a, b) {
    return a && b
  })
}

var inputArray = input.split('\n')
inputArray.pop()

console.log('day8 - part2')
if (test()) {
  console.log('tests pass!\n')
  console.log('solution:')
  console.log('    ' + calculateDifference(encodeInput(inputArray)))
} else {
  console.error('tests failed')
}
console.log()
