var fs = require('fs')

var input = fs.readFileSync(__dirname + '/input', 'utf-8')

function parseInstructions(input) {
  return input.split('\n')
  .filter(x => x)
  .map(function(x) {
    var groups, instruction
    if (/^(\w+)\s([ab])$/.test(x)) {
      groups = /^(\w+)\s([ab])$/.exec(x)
      instruction = {
        cmd: groups[1],
        register: groups[2]
      }
    } else if (/^(\w+)\s([+-])(\d+)$/.test(x)) {
      groups = /^(\w+)\s([+-])(\d+)$/.exec(x)
      instruction = {
        cmd: groups[1],
        sign: groups[2],
        offset: parseInt(groups[3], 10)
      }
    } else if (/^(\w+)\s([ab]),\s([+-])(\d+)$/.test(x)) {
      groups = /^(\w+)\s([ab]),\s([+-])(\d+)$/.exec(x)
      instruction = {
        cmd: groups[1],
        register: groups[2],
        sign: groups[3],
        offset: parseInt(groups[4], 10)
      }
    } else {
      throw new Error('unknown instruction: ' + x)
    }

    return instruction
  })
}

function interpret(registers, instructions) {
  var index = 0
  var executions = 0
  var current

  while(true) {
    if (index >= instructions.length) {
      return { registers: registers, executions: executions }
    }

    executions++
    current = instructions[index]

    // Note: registers can exceed uint32, so we use Math.floor() instead of |0

    if (current.cmd === 'inc') {
      registers[ current.register ]++
    } else if (current.cmd === 'hlf') {
      registers[ current.register ] = Math.floor(registers[ current.register ] / 2)
    } else if (current.cmd === 'tpl') {
      registers[ current.register ] = Math.floor(registers[ current.register ] * 3)
    } else if (current.cmd === 'jmp') {
      if (current.sign === '+') {
        index += current.offset
      } else if (current.sign === '-') {
        index -= current.offset
      } else {
        throw new Error('unknown sign: ' + JSON.stringify(current))
      }
      continue
    } else if (current.cmd === 'jie') {
      if (registers[ current.register ] % 2 === 0) {
        if (current.sign === '+') {
          index += current.offset
        } else if (current.sign === '-') {
          index -= current.offset
        } else {
          throw new Error('unknown sign: ' + JSON.stringify(current))
        }

        continue
      }
    } else if (current.cmd === 'jio') {
      if (registers[ current.register ] === 1) {
        if (current.sign === '+') {
          index += current.offset
        } else if (current.sign === '-') {
          index -= current.offset
        } else {
          throw new Error('unknown sign: ' + JSON.stringify(current))
        }

        continue
      }
    } else {
      throw new Error('unknown cmd: ' + JSON.stringify(current))
    }

    index++
  }
}

var instructions = parseInstructions(input)
var registers = { a: 0, b: 0 }

console.log('day23')
console.log('day23 - part1')
console.log('solution:')
console.log('    ' + interpret(registers, instructions).registers.b)
console.log()

registers = { a: 1, b: 0 }

console.log('day23 - part1')
console.log('solution:')
console.log('    ' + interpret(registers, instructions).registers.b)
console.log()
