
exports.up = function(knex, Promise) {
  const secondPromise = new Promise((resolve, reject) => {
    resolve()
    //don't throw warning
  });
  return secondPromise
};

exports.down = function(knex, Promise) {
  const secondPromise = new Promise((resolve, reject) => {
    resolve()
    //  also don't throw warning
  });
  return secondPromise
};
