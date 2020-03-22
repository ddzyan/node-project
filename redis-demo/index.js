const db = require('./redis-client');

/* db.set('hello', 'word', -1, (error, result) => {
  if (error) {
    console.error('redis set error', error);
    return;
  }
  console.info(result);
})
 */
db.get('hello', (error, result) => {
  if (error) {
    console.error('redis set error', error);
    return;
  }
  console.info(result);
})