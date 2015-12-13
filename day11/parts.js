var CONSTANTS = {
  Z: 'z'.charCodeAt(0),
  A: 'a'.charCodeAt(0),
  I: 'i'.charCodeAt(0),
  O: 'o'.charCodeAt(0),
  L: 'l'.charCodeAt(0)
}

function hasIncreasingStraight(x) {
  for (var i = 0; i < x.length - 3; i++) {
    if (x[i] + 1 === x[i + 1] &&
        x[i + 1] + 1 === x[i + 2]) {
      return true
    }
  }

  return false
}

function hasInvalidChars(buffer) {
  return buffer.indexOf(CONSTANTS.I) > -1 ||
         buffer.indexOf(CONSTANTS.O) > -1 ||
         buffer.indexOf(CONSTANTS.L) > -1
}

function hasMultiplePairs(buffer) {
  var pairs = []
  var count = 0

  for (var i = 0; i < buffer.length; i++) {
    if (buffer[i] === buffer[i + 1]) {
      pairs.push(i)
    }
  }

  if (!pairs.length) return false

  pairs.reduce(function(a, b) {
    if (b >= a + 2) {
      count++
      return b
    } else {
      return a
    }
  })

  return count > 0
}

function isValid(buffer) {
  return hasIncreasingStraight(buffer) &&
         !hasInvalidChars(buffer) &&
         hasMultiplePairs(buffer)
}

// TODO: don't wrap around alphabet, just roll over at Z ...
function nextValidPassword(x, increment) {
  var buffer = new Buffer(x)
  var offset = 1
  var valid = 0
  var target

  increment = increment || 1

  while (true) {
    target = buffer.length - offset

    if (buffer[target] === CONSTANTS.Z) {
      if (offset === buffer.length) {
        throw new Error('iterated through entire buffer')
      }

      // wrap around, and skip the test ("carry" the change to the next offset)
      buffer[target] = CONSTANTS.A
      offset++
      continue
    } else {
      buffer[target] = buffer[target] + 1
      offset = 1
    }

    if (isValid(buffer)) {
      valid++
      if (valid === increment) {
        return buffer.toString()
      }
    }
  }
}

function test() {
  return [
    !isValid(new Buffer('hijklmmn')),
    !isValid(new Buffer('abbceffg')),
    !isValid(new Buffer('abbcegjk')),
    isValid(new Buffer('abcdffaa')),
    isValid(new Buffer('ghjaabcc')),
    nextValidPassword('abcdefgh') === 'abcdffaa',
    nextValidPassword('ghijklmn') === 'ghjaabcc'
  ]
  .reduce(function(a, b) {
    return a && b
  })
}

console.log('day11')
if (test()) {
  console.log('tests pass!\n')
  console.log('day11 - part1')
  console.log('solution:')
  console.log('    ' + nextValidPassword('hxbxwxba'))
  console.log()
  console.log('day11 - part2')
  console.log('solution')
  console.log('    ' + nextValidPassword('hxbxwxba', 2))
} else {
  console.error('tests failed')
}
console.log()
