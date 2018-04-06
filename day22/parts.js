var fs = require('fs')

var input = fs.readFileSync(__dirname + '/input', 'utf-8')

var spells = [
  { name: 'Magic Missile', cost: 53, damage: 4 },
  { name: 'Drain', cost: 73, damage: 2, heal: 2 },
  { name: 'Shield', cost: 113, armor: 7, duration: 6 },
  { name: 'Poison', cost: 173, damage: 3, duration: 6 },
  { name: 'Recharge', cost: 229, duration: 5, mana: 101 }
]

// adapted from 9
function permutations(x) {
  if (x.length === 1) {
    return [x]
  }
  if (x.length === 2) {
    return [x, x.slice(0).reverse()]
  }

  return x.map(function(y, i) {
    var clone = x.slice(0)
    clone.splice(i, 1)

    return permutations(clone).map(z => [y].concat(z))
  })
  .reduce((a, b) => a.concat(b), [])
}

// from 17
function combinations(x) {
  var results = x.map(y => [y])
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

function getSpellIndexes() {
  var indexes = []

  for (var i = 0; i < spells.length; i++) {
    indexes.push(i)
  }

  return indexes
}

// from 21
function parseBoss(input) {
  var boss = {}

  input.split('\n').filter(x => x)
  .forEach(function(line) {
    var num = parseInt(/(\d+)$/.exec(line)[1], 10)
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

// from 21
function copy(x) {
  var y = {}

  Object.keys(x).forEach(z => y[z] = x[z])

  return y
}

function rand(min, max) {
  if (max === undefined) {
    max = min
    min = 0
  }
  return Math.floor(Math.random() * (max - min)) + min
}

// function getSpell(effects, index) {
//   var spell = spells[ index % spells.length ]

//   if (!effects.filter(x => x.name === spell.name).length) {
//     return spell
//   }

//   return spells[ rand(2) ]
// }

function getSpell(effects, index) {
  var current = effects.map(x => x.name)
  var available = spells.filter(x => current.indexOf(x.name) === -1)

  return spells[ rand(available.length) ]
}

function getEffect(effects, name) {
  return effects.filter(x => x[name])
}

function getEffectValue(effects, name) {
  return getEffect(effects, name)
  .map(x => x[name])
  .reduce((a, b) => a + b)
}

function play(player, boss, isPart2) {
  var move = 1
  var effects = []
  var bonus = 0
  var ogMana = player.mana
  var armor, damage, spell, spellIndex, spent, current, available
  var spellIndexes = []

  while (player.points > 0 && boss.points > 0) {
    // console.log('player: ' + player.points + '; boss: ' + boss.points)

    if (effects.map(x => x.name).length !==
        effects.map(x => x.name).filter((x, i, self) => self.indexOf(x) === i).length) {
      throw new Error('duplicate effects')
    }

    if (isPart2) {
      player.points--
    }

    // prune expired effects
    effects = effects.filter(x => x.duration > 0)
    effects.filter(x => x.duration).forEach(x => x.duration--)

    if (getEffect(effects, 'damage').length) {
      boss.points -= getEffectValue(effects, 'damage')
    }

    if (getEffect(effects, 'heal').length) {
      // console.log('healing: ' + player.points)
      player.points += getEffectValue(effects, 'heal')
      // console.log('healed: ' + player.points)
    }

    if (getEffect(effects, 'mana').length) {
      bonus += getEffectValue(effects, 'mana')
    }

    // if (boss.points <= 0 || player.points <= 0) {
    //   break
    // }

    if (move % 2 === 0) {
      // console.log('boss move: ' + move)

      armor = 0
      if (getEffect(effects, 'armor').length) {
        armor += getEffectValue(effects, 'armor')
      }

      player.points -= Math.max(1, boss.damage - armor)
    } else {
      // console.log('my move: ' + move)

      // spellIndex = spellIndexes[((move - 1) / 2) % spellIndexes.length]
      // spell = getSpell(effects, spellIndex)
      current = effects.map(x => x.name)
      available = spells.filter(x => current.indexOf(x.name) === -1)
      spellIndex = rand(available.length)
      spellIndexes.push(spellIndex)
      spell = available[spellIndex]

      if (spell.cost > player.mana + bonus) {
        return { win: false, spells: spellIndexes }
      }

      bonus -= spell.cost
      spent = (spent || 0) + spell.cost
      if (bonus < 0) {
        player.mana += bonus
        bonus = 0
      }

      if (spell.duration) {
        effects.push(copy(spell))
      } else {
        if (spell.damage) {
          boss.points -= Math.max(1, spell.damage - (boss.armor || 0))
        }
        if (spell.heal) {
          player.points += spell.heal
        }
      }
    }

    move++
  }

  return {
    win: boss.points <= 0,
    // cost: ogMana - player.mana,
    cost: spent,
    spells: spellIndexes
   }
}

function playAll(player, boss, isPart2) {
  // var spellIndexes = combinations(getSpellIndexes())
  // .map(x => permutations(x))
  // .reduce((a, b) => a.concat(b), [])

  // return spellIndexes.map(x => play(copy(player), copy(boss), x))

  var results = []
  var result

  for (var i = 0; i < 1000000; i++) {
    result = play(copy(player), copy(boss), isPart2)
    if (result.win) {
      results.push(result)
    }
  }

  return results // .filter(x => x.win)
  .sort((a, b) => a.cost - b.cost)
  .slice(0, 10)
}


// return console.log(play({ points: 10, mana: 250 }, { points: 13, damage: 8 }, [3, 0]))
// return console.log(play({ points: 10, mana: 250 }, { points: 14, damage: 8 }, [4, 2, 1, 3, 0]))

var boss = parseBoss(input)
var player = { points: 50, mana: 500 }

// return console.log(play(player, boss, [ 4, 3, 2 ]))

// return console.log(playAll(player, boss, false))
return console.log(playAll(player, boss, true))
