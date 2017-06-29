
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('folders', (table) => {
      table.string('name').unique().alter()
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('folders', (table) => {
      table.dropUnique('name')
    })
  ]);
};
