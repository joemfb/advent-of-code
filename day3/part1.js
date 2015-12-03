var fs = require('fs')

var input = fs.readFileSync('./input', 'utf-8')

function walk(input) {
  var grid = {
    '0,0': {
      x: 0,
      y: 0,
      visits: [null]
    }
  }
  var x = 0
  var y = 0
  var key

  for (var i = 0; i < input.length; i++) {
    switch(input[i]) {
      case '^':
        ++y
        break
      case 'v':
        --y
        break
      case '>':
        ++x
        break
      case '<':
        --x
        break
    }

    key = x.toString() + ',' + y.toString()
    if (grid[key]) {
      grid[key].visits.push(i)
    } else {
      grid[key] = {
        x: x,
        y: y,
        visits: [i]
      }
    }
  }
  return grid
}

function test() {
  return [
    Object.keys(walk('>')).length === 2,
    Object.keys(walk('^>v<')).length === 4,
    Object.keys(walk('^v^v^v^v^v')).length === 2
  ]
  .reduce(function(a, b) {
    return a && b
  })
}

if (test()) {
  console.log('tests pass!\n')
  console.log('solution:')
  console.log('    ' + Object.keys(walk(input)).length)
} else {
  console.error('tests failed')
}
