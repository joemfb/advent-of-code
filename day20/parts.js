
// solved this way
function getUncachedHouse(target) {
  var house = 1
  var presents, elf

  while (true) {
    presents = 0

    for (elf = 1; elf <= house; elf++) {
      if (house % elf === 0) {
        presents += elf * 10
      }
    }

    // console.log('house ' + house + '; ' + presents)

    if (presents >= target) {
      return house
    }

    if (house % 10000 === 0) {
      console.log(house)
    }

    house++
  }
}

function getUncachedLazyHouse(target) {
  var house = 1
  var presents, elf

  while (true) {
    presents = 0

    for (elf = 1; elf <= house; elf++) {
      if (house / elf > 51) {
        continue
      }
      if (house % elf === 0) {
        presents += elf * 11
      }
    }

    if (presents >= target) {
      return house
    }

    // if (house % 10000 === 0) {
    //   console.log(house)
    // }

    house++
  }
}

// based on faster algorithm from https://www.reddit.com/r/adventofcode/comments/3xjpp2/day_20_solutions/
// (inverted loop + cached results)
function getHouse(target) {
  var cache = []
  var elf, house

  for (elf = 1; elf < target / 10; elf++) {
    for (house = elf; house < target / 10; house += elf) {
      cache[house] = (cache[house] || 0) + elf * 10
    }
  }

  for (house = 1; house < cache.length; house++) {
    if (cache[house] >= target) return house
  }

  throw new Error('coudn\'t find target')
}

function getLazyHouse(target) {
  var cache = []
  var elf, house, visits

  for (elf = 1; elf < target / 10; elf++) {
    visits = 0

    for (house = elf; house <= target / 10; house += elf) {
      cache[house] = (cache[house] || 0) + elf * 11
      if (visits > 50) {
        break
      }

      visits++
    }
  }

  for (house = 1; house < cache.length; house++) {
    if (cache[house] >= target) return house
  }

  throw new Error('coudn\'t find target')
}

console.log('day20')
console.log('day20 - part1')
console.log('solution:')
// console.log('    ' + console.log(getUncachedHouse(33100000)))
console.log('    ' + getHouse(33100000))
console.log()
console.log('day20 - part2')
console.log('solution:')
// console.log('    ' + getUncachedLazyHouse(33100000))
console.log('    ' + getLazyHouse(33100000))
console.log()
