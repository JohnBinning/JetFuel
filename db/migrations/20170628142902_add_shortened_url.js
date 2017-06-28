
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('links', (table) => {
      table.string('shortened_url')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('links', (table) => {
      table.dropColumn('shortened_url')
    })
  ])
};
