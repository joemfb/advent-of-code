var fs = require('fs')

var input = fs.readFileSync(__dirname + '/input', 'utf-8')

function asArray() {
  if ( arguments.length === 1 && Array.isArray(arguments[0]) ) {
    return arguments[0]
  } else {
    return [].slice.call(arguments)
  }
}

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

function parseDistance(distance) {
  var groups = /^(\w+)\sto\s(\w+)\s=\s(\d+)$/.exec(distance)
  return {
    from: groups[1],
    to: groups[2],
    distance: parseInt(groups[3], 10)
  }
}

function calculateTrips(distanceStrings, axis) {
  var locations = []

  var distances = distanceStrings.map(function(d) {
    var parsed = parseDistance(d)
    locations.push(parsed.from, parsed.to)
    return parsed
  })

  locations = locations.filter(function(l, i, self) {
    return self.indexOf(l) === i
  })

  var trips = permutations(locations).map(function(trip) {
    var tripDistance = 0

    trip.reduce(function(a, b) {
      var distance = distances.filter(function(d) {
        return (d.from === a && d.to === b) ||
               (d.from === b && d.to === a)
      })[0]

      if (!distance) throw new Error('unknown distance between: "' + a + '" and "' + b + '"')

      tripDistance += distance.distance

      return b
    })

    return tripDistance
  })

  if (axis === 'shortest') {
    return trips.sort()[0]
  } else if (axis === 'longest') {
    return trips.sort(function(a, b) {
      return b - a
    })[0]
  } else {
    throw new Error('unknown trip axis: ' + axis)
  }
}

function test() {
  return [
    permutations([1]).length === 1,
    permutations([1, 2]).length === 2,
    permutations([1, 2, 3]).length === 6,
    permutations([1, 2, 3, 4]).length === 24,
    permutations([1, 2, 3, 4, 5]).length === 120,
    parseDistance('London to Dublin = 464').distance === 464,
    calculateTrips([
      'London to Dublin = 464',
      'London to Belfast = 518',
      'Dublin to Belfast = 141'
    ], 'shortest') === 605,
    calculateTrips([
      'London to Dublin = 464',
      'London to Belfast = 518',
      'Dublin to Belfast = 141'
    ], 'longest') === 982
  ]
  .reduce(function(a, b) {
    return a && b
  })
}

var inputArray = input.split('\n')
inputArray.pop()

console.log('day9')
if (test()) {
  console.log('tests pass!\n')
  console.log('day9 - part1')
  console.log('solution:')
  console.log('    ' + calculateTrips(inputArray, 'shortest'))
  console.log()
  console.log('day9 - part2')
  console.log('solution:')
  console.log('    ' + calculateTrips(inputArray, 'longest'))
} else {
  console.error('tests failed')
}
console.log()
