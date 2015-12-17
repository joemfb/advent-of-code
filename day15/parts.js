var fs = require('fs')

var input = fs.readFileSync(__dirname + '/input', 'utf-8')

function parse(x) {
  var groups = /^(\w+): capacity (-?\d), durability (-?\d), flavor (-?\d), texture (-?\d), calories (-?\d)$/.exec(x)

  return {
    name: groups[1],
    properties: {
      capacity: parseInt(groups[2], 10),
      durability: parseInt(groups[3], 10),
      flavor: parseInt(groups[4], 10),
      texture: parseInt(groups[5], 10),
      calories: parseInt(groups[6], 10)
    }
  }
}

function parseInput(inputArray) {
  var result = {}

  inputArray.forEach(function(line) {
    var parsed = parse(line)

    result[parsed.name] = parsed.properties
  })

  return result
}

// generate all the n-length partitions of x
// TODO: fix this crap
function partition(x, n, min) {
  min = min || 1

  var first = new Array(n - 1).fill(min)

  first.unshift(x - (min * (n -1)))

  var partitions = [first]
  var clone = first
  var tail
  var shouldTail = false

  while (true) {
    for (var i = 1; i < first.length; i++) {
      clone = clone.slice(0)

      if (x - clone[0] >= 3) {
        tail = clone.slice(0)
        shouldTail = true
      }

      // this works for n < 4 ...
      if (shouldTail && i > 1) {
        while (tail[0] >= tail[1]) {
          tail = tail.slice(0)
          tail[0] = tail[0] - 1
          tail[1] = tail[1] + 1

          if (tail[0] < tail[1]) continue

          partitions.push(tail)
        }
        shouldTail = false
      }

      clone[0] = clone[0] - 1
      clone[i] = clone[i] + 1

      if (clone[0] < clone[1]) return partitions

      partitions.push(clone)
    }
  }
}

function asArray() {
  if ( arguments.length === 1 && Array.isArray(arguments[0]) ) {
    return arguments[0]
  } else {
    return [].slice.call(arguments)
  }
}

function arrayEqual(x, y) {
  var equal = x.length === y.length

  for (var i = 0; i < x.length; i++) {
    if (Array.isArray(x[i]) && Array.isArray(y[i])) {
      equal = equal && arrayEqual(x[i], y[i])
    } else {
      equal = equal && x[i] === y[i]
    }
  }

  return equal
}

function containsNested(x, y) {
  return x.filter(function(z) {
    return arrayEqual(z, y)
  }).length
}

// adapted from day9
function uniquePermutations(x) {
  if (x.length === 1) return [x]

  if (x.length === 2) {
    if (x[0] === x[1]) return [x]

    return [x, x.slice(0).reverse()]
  }

  var clones = []
  var clone

  for (var i = 0; i < x.length; i++) {
    clone = x.slice(0)
    clone.splice(i, 1)
    if (!containsNested(clones, [x[i], clone])) {
      clones.push([x[i], clone])
    }
  }

  return clones.map(function(clone) {
    return uniquePermutations(clone[1]).map(function(z) {
      return [clone[0]].concat(z)
    })
  })
  .reduce(function(a, b) {
    return a.concat(asArray(b))
  }, [])
}

// generate all the n-length compositions of x
function _composition(x, n, min) {
  var compositions = []

  partition(x, n, min).forEach(function(partition) {
    [].push.apply(compositions, uniquePermutations(partition))
  })

  return compositions
}

function composition(x, n, min) {
  min = min || 1

  if (n < 4) {
    return _composition(x, n, min)
  } else if (n > 4) {
    throw new Error('not implemented')
  }

  // cop-out ...
  var results = []

  for (var i = min; i < x; i++) {
    for (var j = min; j < x; j++) {
      for (var k = min; k < x; k++) {
        for (var l = min; l < x; l++) {
          if (i + j + k + l === x) {
            results.push([i, j, k, l])
          }
        }
      }
    }
  }

  return results
}

function scoreRecipe(ingredients, amounts, parsed) {
  var properties = Object.keys(parsed[ingredients[0]])
  var recipe = {
    score: 1,
    calories: 0,
    properties: {},
    ingredients: {}
  }

  var ingredientScores = {}

  ingredients.forEach(function(ingredient, i) {
    var amount = amounts[i]
    var info = parsed[ingredient]
    var scores = {}

    properties.forEach(function(property) {
      scores[property] = amount * info[property]
    })

    recipe.ingredients[ingredient] = amount
    ingredientScores[ingredient] = scores
  })

  properties.forEach(function(property) {
    var score = 0

    ingredients.forEach(function(ingredient) {
      score += ingredientScores[ingredient][property]
    })

    if (property === 'calories') {
      recipe.calories += score
    } else {
      recipe.properties[property] = Math.max(0, score)
      recipe.score *= recipe.properties[property]
    }
  })

  return recipe
}

function scoreRecipes(parsed) {
  var ingredients = Object.keys(parsed)
  var compositions = composition(100, ingredients.length)

  return compositions.map(function(composition) {
    return scoreRecipe(ingredients, composition, parsed)
  })
  .sort(function(a, b) {
    return b.score - a.score
  })
}

function scoreRecipeCalories(parsed) {
  return scoreRecipes(parsed).filter(function(x) {
    return x.calories === 500
  })
}

function test() {
  var testInput = [
    'Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8',
    'Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3'
  ]

  return scoreRecipes(parseInput(testInput))[0].score === 62842880
}

var inputArray = input.split('\n')
inputArray.pop()

var parsed = parseInput(inputArray)

console.log('day15')
if (test()) {
  console.log('tests pass!\n')
  console.log('day15 - part1')
  console.log('solution:')
  console.log('    ' + scoreRecipes(parsed)[0].score)
  console.log()
  console.log('day15 - part2')
  console.log('solution:')
  console.log('    ' + scoreRecipeCalories(parsed)[0].score)
} else {
  console.error('tests failed')
}
console.log()
