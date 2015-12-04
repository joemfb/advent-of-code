var md5 = require('md5')

function findHashSuffix(key) {
  var suffix = 1;
  var hash;

  while (true) {
    hash = md5(key + suffix)
    if (hash.substring(0, 5) === '00000') {
      return suffix
    } else {
      suffix++
    }
  }
}

function test() {
  return [
    findHashSuffix('abcdef') === 609043,
    findHashSuffix('pqrstuv') === 1048970
  ]
  .reduce(function(a, b) {
    return a && b
  })
}

console.log('day4 - part1')
if (test()) {
  console.log('tests pass!\n')
  console.log('solution:')
  console.log('    ' + findHashSuffix('yzbqklnj'))
} else {
  console.error('tests failed')
}
console.log()
