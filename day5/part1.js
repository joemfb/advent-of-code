var fs = require('fs')

var input = fs.readFileSync(__dirname + '/input', 'utf-8')

var disallowed = ['ab', 'cd', 'pq', 'xy']

function allMatches(x, r) {
  var matches = []
  var match

  while ((match = r.exec(x)) !== null) {
    matches.push(match)
  }

  return matches
}

function threeVowels(x) {
  return allMatches(x, /[aeiou]/g).length >= 3
}

function doubleLetter(x) {
  for (var i = 0; i < x.length - 1; i++) {
    if (x[i] === x[i + 1]) {
      return true;
    }
  }
  return false
}

function notDisallowed(x) {
  return disallowed.map(function(pair) {
    return x.indexOf(pair) === -1
  })
  .reduce(function(a, b) {
    return a && b
  })
}

function isNice(x) {
  return threeVowels(x) && doubleLetter(x) && notDisallowed(x)
}

function test() {
  return [
    isNice('ugknbfddgicrmopn'),
    isNice('aaa'),
    !isNice('jchzalrnumimnmhp'),
    !isNice('haegwjzuvuyypxyu'),
    !isNice('dvszwmarrgswjxmb')
  ]
  .reduce(function(a, b) {
    return a && b
  })
}

function countNiceStrings(arr) {
  return arr.map(function(x) {
    return isNice(x) & 1
  })
  .reduce(function(a, b) {
    return a + b
  })
}

console.log('day5 - part1')
if (test()) {
  console.log('tests pass!\n')
  console.log('solution:')
  console.log('    ' + countNiceStrings(input.split('\n')))
} else {
  console.error('tests failed')
}
console.log()
