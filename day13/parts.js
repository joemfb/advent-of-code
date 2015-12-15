var fs = require('fs')

var input = fs.readFileSync(__dirname + '/input', 'utf-8')

function parse(x) {
  var groups = /^(\w+) would (\w+) (\d+) happiness units by sitting next to (\w+)\.$/.exec(x)

  var result = {
    name: groups[1],
    units: parseInt(groups[3], 10),
    target: groups[4]
  }

  if (groups[2] === 'gain') {
    result.gain = true
  } else if (groups[2] === 'lose') {
    result.lose = true
  }

  return result
}

function append(obj, key, value) {
  if (obj[key]) {
    obj[key].push(value);
  } else {
    obj[key] = [value];
  }
}

function parseInput(inputArray) {
  var result = {}

  inputArray.forEach(function(line) {
    var parsed = parse(line)

    append(result, parsed.name, parsed)
  })

  return result
}

function asArray() {
  if ( arguments.length === 1 && Array.isArray(arguments[0]) ) {
    return arguments[0]
  } else {
    return [].slice.call(arguments)
  }
}

// from day9
function permutations(x) {
  if (x.length === 1) {
    return [x]
  }
  if (x.length === 2) {
    return [x, x.slice(0).reverse()]
  }

  return x.map(function(y, i) {
    var clone = x.slice(0)
    clone.splice(i, 1)

    return permutations(clone).map(function(z) {
      return [y].concat(z)
    })
  })
  .reduce(function(a, b) {
    return a.concat(asArray(b))
  }, [])
}

function calculateHappiness(parsed) {
  var happiness = {}

  Object.keys(parsed).forEach(function(key) {
    parsed[key].forEach(function(entry) {
      var composite = entry.name + ',' + entry.target
      happiness[composite] = entry.gain ? +entry.units : -entry.units
    })
  })

  return happiness
}

function getFeelings(arrangement, happiness) {
  var feelings = []
  var a, b, key, inverseKey

  for (var i = 0; i < arrangement.length; i++) {
    a = i
    b = (i + 1) % arrangement.length
    key = arrangement[a] + ',' + arrangement[b]
    inverseKey = arrangement[b] + ',' + arrangement[a]

    feelings.push(happiness[key], happiness[inverseKey])
  }

  return feelings
}

function happiestArrangment(parsed) {
  var happiness = calculateHappiness(parsed)
  var people = Object.keys(parsed)
  var arrangements = permutations(people)

  return arrangements.map(function(arrangement){
    return getFeelings(arrangement, happiness)
    .reduce(function(a, b) {
      return a + b
    })
  })
  .sort(function(a, b) {
    return b - a
  })[0]
}

function addMe(parsed) {
  var me = []
  Object.keys(parsed).forEach(function(person) {
    me.push({ name: 'Me', units: 0, gain: true, target: person })
    parsed[person].push({ name: person, units: 0, gain: true, target: 'Me' })
  })

  parsed['Me'] = me
}

function test() {
  var testInput = [
    'Alice would gain 54 happiness units by sitting next to Bob.',
    'Alice would lose 79 happiness units by sitting next to Carol.',
    'Alice would lose 2 happiness units by sitting next to David.',
    'Bob would gain 83 happiness units by sitting next to Alice.',
    'Bob would lose 7 happiness units by sitting next to Carol.',
    'Bob would lose 63 happiness units by sitting next to David.',
    'Carol would lose 62 happiness units by sitting next to Alice.',
    'Carol would gain 60 happiness units by sitting next to Bob.',
    'Carol would gain 55 happiness units by sitting next to David.',
    'David would gain 46 happiness units by sitting next to Alice.',
    'David would lose 7 happiness units by sitting next to Bob.',
    'David would gain 41 happiness units by sitting next to Carol.'
  ]
  var parsed = parseInput(testInput)

  return happiestArrangment(parsed) === 330
}

var inputArray = input.split('\n')
inputArray.pop()

var parsed = parseInput(inputArray)

console.log('day13')
if (test()) {
  console.log('tests pass!\n')
  console.log('day13 - part1')
  console.log('solution:')
  console.log('    ' + happiestArrangment(parsed))
  console.log()
  console.log('day13 - part2')
  console.log('solution:')

addMe(parsed)

  console.log('    ' + happiestArrangment(parsed))
} else {
  console.error('tests failed')
}
console.log()
