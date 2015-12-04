var md5 = require('md5')

function findHashSuffix(key) {
  var suffix = 1;
  var hash;

  while (true) {
    hash = md5(key + suffix)
    if (hash.substring(0, 6) === '000000') {
      return suffix
    } else {
      suffix++
    }
  }
}

console.log('day4 - part2')
console.log('solution:')
console.log('    ' + findHashSuffix('yzbqklnj'))
console.log()
