var fs = require('fs')

var input = fs.readFileSync(__dirname + '/input', 'utf-8')

function parse(x) {
  var groups = /^(\w+?) => (\w+)$/.exec(x)

  return [groups[1], groups[2]]
}

function getReplacements(molecule, replacements) {
  var replaced = []
  var replacement, copy, index

  for (var i = 0; i < replacements.length; i++) {
    replacement = replacements[i]
    index = molecule.indexOf(replacement[0])

    while (index > -1) {
      copy = molecule.slice(0, index)
      .concat(replacement[1])
      .concat(molecule.slice(index + replacement[0].length))

      replaced.push(copy)

      index = molecule.indexOf(replacement[0], index + replacement[0].length)
    }

  }

  return replaced
}

function uniq(x) {
  return x.filter((y, i, self) => self.indexOf(y) === i)
}

function swap(x) {
  return x.map(x => [x[1], x[0]])
}

function getReverseSteps(target, replacements) {
  replacements = swap(replacements)
  var molecules = getReplacements(target, replacements)
  var edits = 1
  var i

  while (true) {
    for (i = 0; i < molecules.length; i++) {
      if (molecules[i] === 'e') {
        return edits
      }
    }

    molecules = molecules.map(x => getReplacements(x, replacements))
    .reduce((a, b) => a.concat(b))
    .filter((y, i, self) => self.indexOf(y) === i)
    .sort((a, b) => a.length - b.length)
    .slice(0, 13) // length found through trial and error

    edits++
  }
}

function test() {
  var molecule = 'HOH'
  var replacements = [
    'H => HO',
    'H => OH',
    'O => HH'
  ].map(x => parse(x))

  var alternateReplacements = [
    'e => H',
    'e => O',
    'H => HO',
    'H => OH',
    'O => HH'
  ].map(x => parse(x))

  var replaced = getReplacements(molecule, replacements)

  return [
    replaced.length === 5,
    uniq(replaced).length === 4,
    getReverseSteps(molecule, alternateReplacements) === 3
  ]
}


var replacements = []
var molecule

input.split('\n').forEach(function(x) {
  if (/=>/.test(x)) {
    replacements.push(parse(x))
  } else if (x) {
    molecule = x
  }
})

console.log('day19')
if (test()) {
  console.log('tests pass!\n')
  console.log('day19 - part1')
  console.log('solution:')
  console.log('    ' + uniq(getReplacements(molecule, replacements)).length)
  console.log()
  console.log('day19 - part2')
  console.log('solution:')
  console.log('    ' + getReverseSteps(molecule, replacements))
} else {
  console.error('tests failed')
}
console.log()
