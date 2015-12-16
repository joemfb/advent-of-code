var fs = require('fs')

var input = fs.readFileSync(__dirname + '/input', 'utf-8')

function parse(x) {
  var groups = /^(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds\.$/.exec(x)

  return {
    name: groups[1],
    rate: parseInt(groups[2], 10),
    duration: parseInt(groups[3], 10),
    rest: parseInt(groups[4], 10)
  }
}

function parseInput(inputArray) {
  var result = {}

  inputArray.forEach(function(line) {
    var parsed = parse(line)

    result[parsed.name] = parsed
  })

  return result
}

function calculateDistance(reindeer, duration) {
  var elapsed = 0
  var distance = 0
  var rest = false

  if (!duration) return 0

  while (true) {
    if (rest) {
      elapsed += reindeer.rest
      rest = false
      if (elapsed >= duration) return distance
    } else {
      for (var i = 1; i <= reindeer.duration; i++) {
        distance += reindeer.rate
        elapsed += 1
        if (elapsed >= duration) return distance
      }
      rest = true
    }
  }
}

function calculateAll(parsed, duration) {
  var results = []

  Object.keys(parsed).map(function(key) {
    var reindeer = parsed[key]

    results.push({
      name: reindeer.name,
      distance: calculateDistance(reindeer, duration)
    })
  })

  return results
}

function calulateFarthest(parsed, duration) {
  var results = calculateAll(parsed, duration)
  var sorted = results.sort(function(a, b) {
    return b.distance - a.distance
  })

  var farthest = []

  do {
    farthest.push(sorted.shift())
  } while (sorted.length && sorted[0].distance === farthest[0].distance)

  return farthest
}

function secondsInLead(parsed, duration) {
  var result = {}
  var leader

  for (var i = 1; i <= duration; i++) {
    calulateFarthest(parsed, i).forEach(function(leader) {
      result[leader.name] = (result[leader.name] || 0) + 1
    })
  }

  return Object.keys(result).map(function(key) {
    return { name: key, seconds: result[key] }
  })
}

function longestInLead(parsed, duration) {
  var results = secondsInLead(parsed, duration)

  return results.sort(function(a, b) {
    return b.seconds - a.seconds
  })[0]
}

function test() {
  var testInput = [
    'Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.',
    'Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.'
  ]
  var parsed = parseInput(testInput)

  var seconds = secondsInLead(parsed, 1000)

  return [
    calculateDistance(parsed['Comet'], 10) === 140,
    calculateDistance(parsed['Dancer'], 10) === 160,
    calculateDistance(parsed['Comet'], 11) === 140,
    calculateDistance(parsed['Dancer'], 11) === 176,
    calculateDistance(parsed['Comet'], 137) === 140,
    calculateDistance(parsed['Dancer'], 137) === 176,
    calculateDistance(parsed['Comet'], 138) === 154,
    calculateDistance(parsed['Dancer'], 138) === 176,
    calculateDistance(parsed['Comet'], 147) === 280,
    calculateDistance(parsed['Dancer'], 147) === 176,
    calculateDistance(parsed['Comet'], 1000) === 1120,
    calculateDistance(parsed['Dancer'], 1000) === 1056,
    seconds[0].seconds === 689,
    seconds[1].seconds === 312,
  ]
  .reduce(function(a, b) {
    return a && b
  })
}

var inputArray = input.split('\n')
inputArray.pop()

var parsed = parseInput(inputArray)

var farthest = calulateFarthest(parsed, 2503)[0]

console.log('day14')
if (test()) {
  console.log('tests pass!\n')
  console.log('day14 - part1')
  console.log('solution:')
  console.log('    ' + farthest.name + ': ' + farthest.distance)
  console.log()

var longest = longestInLead(parsed, 2503)

  console.log('day14 - part2')
  console.log('solution:')
  console.log('    ' + longest.name + ': ' + longest.seconds)
} else {
  console.error('tests failed')
}
console.log()
