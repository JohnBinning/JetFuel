exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('folders', (table) => {
      table.increments('id').primary()
      table.string('name')
    })
  ])
}

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('folders')
  ])
}
