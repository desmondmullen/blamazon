const strpad = require('strpad');

console.log('*' + strpad.left("foo", 10) + '*');
console.log('*' + strpad.left("bar", 10, "-") + '*');
console.log('*' + strpad.right("foo", 10) + '*');
console.log('*' + strpad.right("bar", 10, "-") + '*');
console.log('*' + strpad.center("foo", 10) + '*');
console.log('*' + strpad.center("bar", 10, "-") + '*');
console.log('*' + strpad.left("19.95", 10) + '*');
console.log('*' + strpad.left("6.95", 10) + '*');
console.log('*' + strpad.right("19.95", 10) + '*');
console.log('*' + strpad.right("6.95", 10) + '*');
console.log('*' + strpad.center("19.95", 10) + '*');
console.log('*' + strpad.center("6.95", 10) + '*');


//strpad.left(price, 10)