var fs = require('fs')

var input = fs.readFileSync('./input', 'utf-8')

function parseInput(input) {
  return input.split('\n').map(function(line) {
    var tokens = line.split('x').map(function(token) {
      return parseInt(token, 10)
    })

    return {
      l: tokens[0],
      w: tokens[1],
      h: tokens[2]
    }
  })
}

function calculatePerimeter(dimensions) {
  var shortestPerimeter = [
    dimensions.l,
    dimensions.w,
    dimensions.h
  ]
  .sort(function(a, b) {
    return a - b
  })
  .slice(0, 2)
  .map(function(side) {
    return side * 2;
  })
  .reduce(function(a, b) {
    return a + b
  })

  var volume = dimensions.l * dimensions.w * dimensions.h

  return shortestPerimeter + volume
}

function calculateAll(input) {
  return parseInput(input)
  .map(calculatePerimeter)
  .reduce(function(a, b) {
    return a + b
  })
}

function test() {
  return [
    calculateAll('2x3x4') === 34,
    calculateAll('1x1x10') === 14
  ]
  .reduce(function(a, b) {
    return a && b
  })
}

if (test()) {
  console.log('tests pass!\n')
  console.log('solution:')
  console.log('    ' + calculateAll(input))
} else {
  console.error('tests failed')
}
