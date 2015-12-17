var fs = require('fs')

var input = fs.readFileSync(__dirname + '/input', 'utf-8')

var report = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1
}

function parse(x) {
  var groups = /^(Sue \d{1,3}): (\w+): (\d+), (\w+): (\d+), (\w+): (\d+)$/.exec(x)

  return {
    name: groups[1],
    properties: [
      { name: groups[2], value: parseInt(groups[3], 10) },
      { name: groups[4], value: parseInt(groups[5], 10) },
      { name: groups[6], value: parseInt(groups[7], 10) }
    ]
  }
}

function parseInput(inputArray) {
  var result = {}

  inputArray.forEach(function(line) {
    var parsed = parse(line)
    var obj = {}

    parsed.properties.forEach(function(x) {
      obj[x.name] = x.value
    })

    result[parsed.name] = obj
  })

  return result
}

function findSue(report, parsed) {
  return Object.keys(parsed).map(function(key) {
    return { name: key, props: parsed[key] }
  })
  .filter(function(aunt) {
    return Object.keys(aunt.props).map(function(prop) {
      return aunt.props[prop] === report[prop]
    })
    .reduce(function(a, b) {
      return a && b
    })
  })
}

function findSueCalibrated(report, parsed) {
  return Object.keys(parsed).map(function(key) {
    return { name: key, props: parsed[key] }
  })
  .filter(function(aunt) {
    return Object.keys(aunt.props).map(function(prop) {
      if (prop === 'cats' || prop === 'trees') {
        return aunt.props[prop] > report[prop]
      } else if (prop === 'pomeranians' || prop === 'goldfish') {
        return aunt.props[prop] < report[prop]
      }

      return aunt.props[prop] === report[prop]
    })
    .reduce(function(a, b) {
      return a && b
    })
  })
}

function test() {
  return false
}

var inputArray = input.split('\n')
inputArray.pop()

var parsed = parseInput(inputArray)

console.log('day16')
console.log('day16 - part1')
console.log('solution:')
console.log('    ' + findSue(report, parsed)[0].name)
console.log()
console.log('day16 - part2')
console.log('solution:')
console.log('    ' + findSueCalibrated(report, parsed)[0].name)
console.log()
