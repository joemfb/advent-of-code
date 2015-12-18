var fs = require('fs')

var input = fs.readFileSync(__dirname + '/input', 'utf-8')

function neighbors(grid, x, y) {
  var results = []
  var iMin = Math.max(x - 1, 0)
  var jMin = Math.max(y - 1, 0)
  var iMax = Math.min(x + 1, grid.length - 1)
  var jMax = Math.min(y + 1, grid[x].length - 1)

  for (i = iMin ; i <= iMax; i++) {
    for (j = jMin ; j <= jMax; j++) {
      if (i !== x || j !== y) {
        results.push(grid[i][j])
      }
    }
  }

  return results
}

function sum(x) {
  if (!Array.isArray(x[0])) {
    return x.reduce((a, b) => a + b)
  }

  return sum(x.map(y => sum(y)))
}

function shouldToggle(grid, x, y) {
  var s = sum(neighbors(grid, x, y))

  if (grid[x][y]) {
    return s < 2 || s > 3
  } else {
    return s === 3
  }
}

function updateLights(grid) {
  var copy = grid.map(x => x.slice(0))
  var x, y

  for (x = 0; x < grid.length; x++) {
    for (y = 0; y < grid[x].length; y++) {
      if (shouldToggle(grid, x, y)) {
        copy[x][y] ^= 1
      }
    }
  }

  return copy
}

function iterateLights(grid, n) {
  n = n || 1

  for (var i = 0; i < n; i++) {
    grid = updateLights(grid)
  }

  return grid
}

function setBounds(grid) {
  grid[0][0] = 1
  grid[0][grid[0].length -1] = 1
  grid[grid.length - 1][0] = 1
  grid[grid.length - 1][ grid[grid.length - 1].length - 1 ] = 1
}

function iterateStuckLights(grid, n) {
  n = n || 1

  setBounds(grid)

  for (var i = 0; i < n; i++) {
    grid = updateLights(grid)
    setBounds(grid)
  }

  return grid
}

function serialize(grid) {
  return grid.map(x => x.map(y => y ? '#' : '.').join('')).join('\n')
}

function parse(input) {
  return input.map(x => x.split('').map(x => x === '#' & 1))
}

function test() {
  var test1 = parse([
    '.#.#.#',
    '...##.',
    '#....#',
    '..#...',
    '#.#..#',
    '####..'
  ])
  var test2 = parse([
    '##.#.#',
    '...##.',
    '#....#',
    '..#...',
    '#.#..#',
    '####.#'
  ])
  var grid = iterateLights(test1, 4)

  return [
      sum(neighbors(grid, 2, 2)) === 3,
      sum(grid) === 4,
      sum(iterateStuckLights(test2, 5)) === 17
  ]
  .reduce((a, b) => a && b)
}

var inputArray = parse(input.split('\n'))
inputArray.pop()

console.log('day18')
if (test()) {
  console.log('tests pass!\n')
  console.log('day18 - part1')
  console.log('solution:')
  console.log('    ' + sum(iterateLights(inputArray, 100)))
  console.log()
  console.log('day18 - part2')
  console.log('solution:')
  console.log('    ' + sum(iterateStuckLights(inputArray, 100)))
} else {
  console.error('tests failed')
}
console.log()
