var fs = require('fs')

var input = fs.readFileSync(__dirname + '/input', 'utf-8')

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

function calculateArea(dimensions) {
  var sides = [
    dimensions.l * dimensions.w,
    dimensions.l * dimensions.h,
    dimensions.w * dimensions.h
  ]

  var area = sides.map(function(side) {
    return side * 2
  }).reduce(function(a, b) {
    return a + b
  })

  var slack = sides.sort(function(a, b) {
    return a - b
  })[0]

  return area + slack
}

function calculateAll(input) {
  return parseInput(input)
  .map(calculateArea)
  .reduce(function(a, b) {
    return a + b
  })
}

function test() {
  return [
    calculateAll('2x3x4') === 58,
    calculateAll('1x1x10') === 43
  ]
  .reduce(function(a, b) {
    return a && b
  })
}

console.log('day2 - part1')
if (test()) {
  console.log('tests pass!\n')
  console.log('solution:')
  console.log('    ' + calculateAll(input))
} else {
  console.error('tests failed')
}
console.log()
