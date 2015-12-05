var fs = require('fs')

var input = fs.readFileSync(__dirname + '/input', 'utf-8')

function getPairs(x) {
  var pairs = []

  for (var i = 0; i < Math.ceil(x.length / 2); i++) {
    if ((i * 2) < x.length - 1) {
      pairs.push(x.slice(i * 2, (i * 2) + 2))
    }
  }
  return pairs
}

function repeatingPairs(x) {
  var evenPairs = getPairs(x)
  var oddPairs = getPairs(x.slice(1))

  var evenMatches = evenPairs.map(function(pair, i) {
    return x.indexOf(pair, (i * 2) + 2) > -1
  })

  var oddMatches = oddPairs.map(function(pair, i) {
    return x.indexOf(pair, (i * 2) + 3) > -1
  })

  var matches = evenMatches.concat(oddMatches)

  if (!matches.length) return false;

  return matches.reduce(function(a, b) {
    return a || b
  })
}

function splitPair(x) {
  for (var i = 0; i < x.length - 2; i++) {
    if (x[i] === x[i + 2]) {
      return true;
    }
  }
  return false
}

function isNice(x) {
  return repeatingPairs(x) && splitPair(x)
}

function test() {
  return [
    !repeatingPairs('aaa'),
    isNice('qjhvhtzxzqqjkmpb'),
    isNice('xxyxx'),
    !isNice('uurcxstgmygtbstg'),
    !isNice('ieodomkazucvgmuy')
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
