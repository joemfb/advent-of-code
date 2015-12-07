var fs = require('fs')

var input = fs.readFileSync(__dirname + '/input', 'utf-8')

function on(grid, x, y) {
  grid[x][y] = 1
}

function off(grid, x, y) {
  grid[x][y] = 0
}

function toggle(grid, x, y) {
  grid[x][y] = grid[x][y] ^ 1
}

function parseCommand(command) {
  if (!/(\d+),(\d+)\sthrough\s(\d+),(\d+)$/.test(command)) {
    console.error('regexp mismatch')
    throw new Error('unknown command: ' + command)
  }

  var groups = /(\d+),(\d+)\sthrough\s(\d+),(\d+)$/.exec(command)
  var result = {
    start: {
      x: parseInt(groups[1], 10),
      y: parseInt(groups[2], 10)
    },
    end: {
      x: parseInt(groups[3], 10),
      y: parseInt(groups[4], 10),
    }
  }

  if (/^turn on/.test(command)) {
    result.apply = on
  } else if (/^turn off/.test(command)) {
    result.apply = off
  }
  else if (/^toggle/.test(command)) {
    result.apply = toggle
  } else {
    throw new Error('unknown command: ' + command)
  }

  return result
}

function applyCommand(grid, cmdStr) {
  if (!cmdStr.length) return

  var cmd = parseCommand(cmdStr)

  for (var x = cmd.start.x; x <= cmd.end.x; x++) {
    for (var y = cmd.start.y; y <= cmd.end.y; y++) {
      cmd.apply(grid, x, y)
    }
  }

  return grid
}

function makeGrid(length) {
  var grid = []

  for (var i = 0; i < length; i++) {
    grid.push(new Array(length).fill(0))
  }

  return grid
}

function configureLights(commands, grid) {
  var grid = grid || makeGrid(1000)

  commands.forEach(function(cmdStr) {
    applyCommand(grid, cmdStr)
  })

  return grid
}

function countLights(grid) {
  var count = 0;

  for (var x = 0; x < grid.length; x++) {
    for (var y = 0; y < grid[x].length; y++) {
      if (grid[x][y]) {
        count++
      }
    }
  }

  return count
}

function configureAndCount(commands) {
  return countLights(configureLights(commands))
}

function testCommands(commands) {
  var grid = makeGrid(10)

  return countLights(configureLights(commands, grid))
}

function test() {
  return [
    testCommands(['turn on 0,0 through 9,9']) === 100,
    testCommands(['turn on 0,0 through 9,9', 'turn off 0,0 through 9,9']) === 0,
    testCommands(['turn on 0,0 through 9,9', 'toggle 0,0 through 9,9']) === 0,
    testCommands(['toggle 0,0 through 9,9']) === 100,
    testCommands(['toggle 0,0 through 9,9', 'toggle 0,0 through 9,9']) === 0,
    testCommands(['turn on 0,0 through 9,9', 'toggle 3,5 through 8,6']) === 88,
    configureAndCount(['turn on 0,0 through 999,999']) === (1000 * 1000),
    configureAndCount(['turn on 499,499 through 500,500']) === 4
  ]
  .reduce(function(a, b) {
    return a && b
  })
}

console.log('day6 - part1')
if (test()) {
  console.log('tests pass!\n')
  console.log('solution:')
  console.log('    ' + countLights(configureLights(input.split('\n'))))
} else {
  console.error('tests failed')
}
console.log()
