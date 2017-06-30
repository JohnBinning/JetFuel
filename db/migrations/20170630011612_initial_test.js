
exports.up = function(knex, Promise) {
  const firstPromise = new Promise((resolve, reject) => {
    resolve()
    //don't throw warning
  });
  return firstPromise
};

exports.down = function(knex, Promise) {
  const firstPromise = new Promise((resolve, reject) => {
    resolve()
    //  also don't throw warning
  });
  return firstPromise
};
