
exports.up = function(knex, Promise) {
return Promise.all([
  knex.schema.createTable('folders', (table) => {
    table.increments('id').primary()
    table.string('name').unique()
  }),
  knex.schema.createTable('links', (table) => {
    table.increments('id').primary()
    table.string('name')
    table.string('url')
    table.integer('folder_id').unsigned()
    table.foreign('folder_id').references('folders.id')
    table.string('shortened_url')
    table.integer('visits')
  })
])
};

exports.down = function(knex, Promise) {
return Promise.all([
  knex.schema.dropTable('links'),
  knex.schema.dropTable('folders')
])
};
