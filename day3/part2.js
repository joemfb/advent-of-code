var fs = require('fs')

var input = fs.readFileSync(__dirname + '/input', 'utf-8')

function walk(input) {
  var grid = {
    '0,0': {
      x: 0,
      y: 0,
      visits: [
        { visitor: 'santa', index: null },
        { visitor: 'robot santa', index: null }
      ]
    }
  }
  var santa = { x: 0, y: 0 }
  var robotSanta = { x: 0, y: 0 }
  var isSanta, target, key

  for (var i = 0; i < input.length; i++) {
    isSanta = !!(i % 2)
    target = isSanta ? santa : robotSanta

    switch(input[i]) {
      case '^':
        ++target.y
        break
      case 'v':
        --target.y
        break
      case '>':
        ++target.x
        break
      case '<':
        --target.x
        break
    }

    key = target.x.toString() + ',' + target.y.toString()
    if (grid[key]) {
      grid[key].visits.push({
        visitor: isSanta ? 'santa' : 'robot santa',
        index: i
      })
    } else {
      grid[key] = {
        x: target.x,
        y: target.y,
        visits: [{
          visitor: isSanta ? 'santa' : 'robot santa',
          index: i
        }]
      }
    }
  }
  return grid
}

function test() {
  return [
    Object.keys(walk('^v')).length === 3,
    Object.keys(walk('^>v<')).length === 3,
    Object.keys(walk('^v^v^v^v^v')).length === 11
  ]
  .reduce(function(a, b) {
    return a && b
  })
}

console.log('day3 - part2')
if (test()) {
  console.log('tests pass!\n')
  console.log('solution:')
  console.log('    ' + Object.keys(walk(input)).length)
} else {
  console.error('tests failed')
}
console.log()
