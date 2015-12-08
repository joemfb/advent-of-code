var fs = require('fs')
var parser = require('./parser.js')

var input = fs.readFileSync(__dirname + '/input', 'utf-8')

function resolve(wires, obj) {
  if (obj.signal == null && obj.symbol == null) {
    throw new Error('invalid input: ' + JSON.stringify(obj))
  }

  if (obj.signal != null) {
    return obj.signal
  } else {
    return wires[obj.symbol]
  }
}

function resolvableCircuit(wires, circuit) {
  if (circuit.input.unary) {
    return resolve(wires, circuit.input.unary.operand) != null
  }

  if (circuit.input.binary) {
    return resolve(wires, circuit.input.binary.leftOperand) != null &&
           resolve(wires, circuit.input.binary.rightOperand) != null
  }

  return resolve(wires, circuit.input) != null
}

function evaluateInput(wires, input) {
  var result = resolve(wires, input)

  if (result == null) {
    throw new Error('invalid input: ' + JSON.stringify(input))
  }

  return result
}

function evaluateUnary(wires, unary) {
  var operand = resolve(wires, unary.operand)
  var result

  if (operand == null) {
    throw new Error('invalid unary operand: ' + JSON.stringify(unary))
  }

  switch(unary.operator) {
    case 'NOT':
      result = (~ operand) & 0xffff // & to rotate as uint16
      break
    default:
      throw new Error('invalid unary operator: ' + JSON.stringify(unary))
  }

  return result
}

function evaluteBinary(wires, binary) {
  var left = resolve(wires, binary.leftOperand)
  var right = resolve(wires, binary.rightOperand)
  var result

  if (left == null) {
    throw new Error('invalid left operand: ' + JSON.stringify(binary))
  }

  if (right == null) {
    throw new Error('invalid right operand: ' + JSON.stringify(binary))
  }

  switch(binary.operator) {
    case 'AND':
      result = left & right
      break
    case 'OR':
      result = left | right
      break
    case 'LSHIFT':
      result = left << right
      break
    case 'RSHIFT':
      result = left >> right
      break
    default:
      throw new Error('invalid binary operator: ' + JSON.stringify(binary))
  }

  return result
}

function evaluteCircuit(wires, circuit) {
  var target = circuit.target.symbol
  var result

  if (!target) {
    throw new Error('invalid circuit: ' + JSON.stringify(circuit))
  }

  if (wires[target]) {
    // each wire can only have one input
    return
  }

  if (circuit.input.unary) {
    result = evaluateUnary(wires, circuit.input.unary)
  } else if (circuit.input.binary) {
    result = evaluteBinary(wires, circuit.input.binary)
  } else {
    result = resolve(wires, circuit.input)
  }

  wires[target] = result
  return wires
}

function emulateCircuits(input) {
  var wires = {}
  var circuits, completed, circuit, currentLength

  if (Array.isArray(input)) {
    circuits = input.map(function(line) {
      return parser.parse(line)[0][0]
    })
  } else {
    circuits = parser.parse(input)[0]
  }

  completed = new Array(circuits.length)

  while (circuits.length) {
    currentLength = circuits.length

    for (var i = 0; i < circuits.length; i++) {
      circuit = circuits[i]

      if (!resolvableCircuit(wires, circuit)) {
        continue
      }

      evaluteCircuit(wires, circuit)
      completed[i] = circuit
      circuits.splice(i, 1)
      i--
    }

    // the lengths are the same because we couldn't resolve symbols
    if (currentLength === circuits.length) {
      throw new Error('unresolveable circuits')
    }
  }

  return wires
}


function test() {
  var sample = emulateCircuits([
    '123 -> x',
    '456 -> y',
    'x AND y -> d',
    'x OR y -> e',
    'x LSHIFT 2 -> f',
    'y RSHIFT 2 -> g',
    'NOT x -> h',
    'NOT y -> i'
  ])

  return [
    emulateCircuits('123 -> x').x === 123,
    sample.d === 72,
    sample.e === 507,
    sample.f === 492,
    sample.g === 114,
    sample.h === 65412,
    sample.i === 65079,
    sample.x === 123,
    sample.y === 456
  ]
  .reduce(function(a, b) {
    return a && b
  })
}

console.log('day6')
if (test()) {
  console.log('tests pass!\n')

  var part1 = emulateCircuits(input)
  var part2 = emulateCircuits( part1.a + ' -> b'.concat(input) )

  console.log('day6 part1')
  console.log('solution:')
  console.log('    ' + part1.a)
  console.log()
  console.log('day6 part2')
  console.log('solution:')
  console.log('    ' + part2.a)
} else {
  console.error('tests failed')
}
console.log()
