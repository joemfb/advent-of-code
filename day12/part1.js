var fs = require('fs')

var input = JSON.parse(fs.readFileSync(__dirname + '/input', 'utf-8'))

function isNumber(x) {
  return typeof x === 'number'
}

function isObject(x) {
  return typeof x === 'object'
}

function truth() { return true }

function sumArray(arr, filter) {
  return arr.map(function(x) {
    return sumNumbers(x, filter)
  })
  .reduce(function(a, b) {
    return a + b
  })
}

function sumObject(obj, filter) {
  var values = Object.keys(obj)
  .map(function(key) {
    return obj[key]
  })

  // console.log(values.filter)
  // console.log(obj)

  if (values.filter(filter).length < values.length) return 0

  return values.map(function(x) {
    return sumNumbers(x, filter)
  })
  .reduce(function(a, b) {
    return a + b
  })
}

function sumNumbers(x, filter) {
  filter = filter || truth

  if (isNumber(x)) {
    return x
  } else if (Array.isArray(x)) {
    return sumArray(x, filter)
  } else if (isObject(x)) {
    return sumObject(x, filter)
  } else {
    return 0
  }
}

console.log('day12 - part1')
console.log(sumNumbers(input, truth))
console.log()
console.log('day12 - part2')
console.log(sumNumbers(input, function(x) {
  return x !== 'red'
}))
