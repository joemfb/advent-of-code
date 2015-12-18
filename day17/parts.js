var fs = require('fs')

var input = fs.readFileSync(__dirname + '/input', 'utf-8')

function combinations(x) {
  var results = []
  var pair, copies, i, j, k

  // loop twice to generate pairs
  for (i = 0; i < x.length - 1; i++) {
    for (j = i + 1; j < x.length; j++) {
      pair = [x[i], x[j]]
      copies = [pair]
      results.push(pair)

      for (k = j + 1; k < x.length; k++) {
        // forEach is unaffected by mutating array
        copies.forEach(function(y) {
          var next = y.concat([x[k]])
          results.push(next)

          if (next.length < x.length) {
            copies.push(next)
          }
        })
      }
    }
  }

  return results
}

function filterCombinations(arr, sum) {
  return combinations(arr)
  .filter(x => sum === x.reduce((a, b) => a + b))
}

function minimumCombinations(arr, sum) {
  return filterCombinations(arr, sum)
  .sort((a, b) => a.length - b.length)
  .filter((x, _, self) => x.length === self[0].length)
}

function test() {
  var testArray = [20, 15, 10, 5, 5]
  return [
    filterCombinations(testArray, 25).length === 4,
    minimumCombinations(testArray, 25).length === 3
  ]
  .reduce((a, b) => a && b)
}

var inputArray = input.split('\n')
.filter(x => x.length)
.map(x => parseInt(x, 10))

console.log('day17')
if (test()) {
  console.log('tests pass!\n')
  console.log('day17 - part1')
  console.log('solution:')
  console.log('    ' + filterCombinations(inputArray, 150).length)
  console.log()
  console.log('day17 - part2')
  console.log('solution:')
  console.log('    ' + minimumCombinations(inputArray, 150).length)
} else {
  console.error('tests failed')
}
console.log()
