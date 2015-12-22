var fs = require('fs')

var input = fs.readFileSync(__dirname + '/input', 'utf-8')

var store = {
  weapons: [
    'Dagger        8     4       0',
    'Shortsword   10     5       0',
    'Warhammer    25     6       0',
    'Longsword    40     7       0',
    'Greataxe     74     8       0'
  ].map(x => parseItems(x)),
  armor: [
    'Leather      13     0       1',
    'Chainmail    31     0       2',
    'Splintmail   53     0       3',
    'Bandedmail   75     0       4',
    'Platemail   102     0       5'
  ].map(x => parseItems(x)),
  rings: [
    'Damage +1    25     1       0',
    'Damage +2    50     2       0',
    'Damage +3   100     3       0',
    'Defense +1   20     0       1',
    'Defense +2   40     0       2',
    'Defense +3   80     0       3'
  ].map(x => parseItems(x)),
}

function parseItems(items) {
  var tokens = items.split(/\s{2,}/).filter(x => x)

  return {
    name: tokens[0],
    cost: parseInt(tokens[1], 10),
    damage: parseInt(tokens[2], 10),
    armor: parseInt(tokens[3], 10)
  }
}

function parseBoss(input) {
  var boss = {}

  input.split('\n').filter(x => x)
  .forEach(function(line) {
    var num = /(\d+)$/.exec(line)[1]
    if (/^Hit/.test(line)) {
      boss.points = num
    } else if (/^Damage/.test(line)) {
      boss.damage = num
    } else if (/^Armor/.test(line)) {
      boss.armor = num
    }
  })

  return boss
}

function copy(x) {
  var y = {}

  Object.keys(x).forEach(z => y[z] = x[z])

  return y
}

function play(player, boss) {
  return player.points / Math.max(1, boss.damage - player.armor) >=
         boss.points / Math.max(1, player.damage - boss.armor)

  // here's what the simulation looks like ...
  // var move = 1
  // var attacker, defender

  // while (player.points > 0 && boss.points > 0) {
  //   if (move % 2 === 0) {
  //     attacker = boss
  //     defender = player
  //   } else {
  //     attacker = player
  //     defender = boss
  //   }

  //   defender.points -= Math.max(1, attacker.damage - defender.armor)
  //   move++
  // }

  // return boss.points <= 0
}

function playFromStore(player, boss) {
  var results = []
  var empty = { cost: 0, damage: 0, armor: 0 }
  var cost, weapon, armor, ring1, ring2

  for (var i = 0; i < store.weapons.length; i++) {
    weapon = store.weapons[i]

    for (var j = -1; j < store.armor.length; j++) {
      if (j > -1) {
        armor = store.armor[j]
      } else {
        armor = empty
      }

      for (var k = -1; k < store.rings.length; k++) {
        if (k > -1) {
          ring1 = store.rings[k]
        } else {
          ring1 = empty
        }

        for (var l = -1; l < store.rings.length; l++) {
          if (l > -1) {
            if (k === l) {
              continue
            }
            ring2 = store.rings[l]
          } else {
            ring2 = empty
          }

          cost = weapon.cost + armor.cost + ring1.cost + ring2.cost
          player.damage = weapon.damage + armor.damage + ring1.damage + ring2.damage
          player.armor = weapon.armor + armor.armor + ring1.armor + ring2.armor

          results.push({ cost: cost, win: play(copy(player), copy(boss)) })
        }
      }
    }
  }

  return results
}

function cheapestWin(results) {
  return results.filter(x => x.win)
  .sort((a, b) => a.cost - b.cost)[0]
}

function priciestLoss(results) {
  return results.filter(x => !x.win)
  .sort((a, b) => b.cost - a.cost)[0]
}

function test() {
  var player = { points: 8, damage: 5, armor: 5 }
  var boss = { points: 12, damage: 7, armor: 2 }

  return play(player, boss)
}

var boss = parseBoss(input)
var player = { points: 100 }

console.log('day21')
if (test()) {
  console.log('tests pass!\n')
  console.log('day21 - part1')
  console.log('solution:')
  console.log('    ' + cheapestWin(playFromStore(player, boss)).cost)
  console.log()
  console.log('day21 - part2')
  console.log('solution:')
  console.log('    ' + priciestLoss(playFromStore(player, boss)).cost)
} else {
  console.error('tests failed')
}
console.log()
