var fs = require('fs')

var input = fs.readFileSync(__dirname + '/input', 'utf-8')

function parseInput(strings) {
  return strings.map(function(line) {
    var parsed

    try {
      parsed = eval(line)
    }
    catch (e) {
      console.error(e)
      console.log(line)
      throw e
    }
    return {
      input: line,
      parsed: parsed,
      rawLength: line.length,
      parsedLength: parsed.length
    }
  })
}

function calculateDifference(parsed) {
  return parsed.reduce(function(a, b) {
    return a + (b.rawLength - b.parsedLength)
  }, 0)
}

function test() {
  return [
    calculateDifference(parseInput([
      '""',
      '"abc"',
      '"aaa\\"aaa"',
      '"\\x27"'
    ])) === 12
  ]
  .reduce(function(a, b) {
    return a && b
  })
}

var inputArray = input.split('\n')
inputArray.pop()

console.log('day8 - part1')
if (test()) {
  console.log('tests pass!\n')
  console.log('solution:')
  console.log('    ' + calculateDifference(parseInput(inputArray)))
} else {
  console.error('tests failed')
}
console.log()
