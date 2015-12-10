function parse(x) {
  var col = []
  var cursor, target

  for (var i = 0; i < x.length; i++) {
    cursor = x[i]
    target = col[0]

    if (target && target[0] === cursor) {
      target.push(cursor)
    } else {
      col.unshift([cursor])
    }
  }

  return col.reverse()
}

function transform(col) {
  return col.map(function(seq) {
    return seq.length + seq[0]
  }).join('')
}

function findPartition(input, guess) {
  guess = guess || Math.floor(input.length / 2)

  if (input[guess - 1] !== input[guess]) {
    return guess
  }

  return findPartition(input, guess - 1)
}

function partition(input, i) {
  return [
    input.slice(0, i),
    input.slice(i)
  ]
}

// almost binary, uses the first appropriate point before the center...
function binarySearch(input, cache) {
  var output

  // chosen arbitrarily
  if (input.length <= 10) {
    output = transform(parse(input))
    return output
  }

  var index = findPartition(input)

  return partition(input, index)
  .map(function(x) {
    return cache[x] ?
           cache[x] :
           binarySearch(x, cache)
  }).join('')
}

function iterate(start, n) {
  var cache = {}
  var input = start
  var output

  for (var i = 0; i < n; i++) {
    output = binarySearch(input, cache)
    cache[input] = output
    input = output
  }

  return output
}

function test() {
  return [
    iterate('1', 1) === '11',
    iterate('1', 2) === '21',
    iterate('11', 1) === '21',
    iterate('1', 3) === '1211',
    iterate('21', 1) === '1211',
    iterate('1', 4) === '111221',
    iterate('1211', 1) === '111221',
    iterate('1', 5) === '312211',
    iterate('111221', 1) === '312211'
  ]
  .reduce(function(a, b) {
    return a && b
  })
}

console.log('day10')
if (test()) {
  console.log('tests pass!\n')
  console.log('day10 - part1')
  console.log('solution:')
  console.log('    ' + iterate('3113322113', 40).length)
  console.log()
  console.log('day10 - part2')
  console.log('solution:')
  console.log('    ' + iterate('3113322113', 50).length)
} else {
  console.error('tests failed')
}
console.log()
