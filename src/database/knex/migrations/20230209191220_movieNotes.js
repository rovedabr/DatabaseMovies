const { default: knex } = require("knex");

exports.up = knex => knex.schema.createTable("movieNotes", table => {
  table.increments("id")
  table.text("title").notNullable()
  table.text("description")
  table.enu("rating", [1, 2, 3, 4, 5])
  table.integer("user_id").references("id").inTable("users")
  table.timestamp("created_at").default(knex.fn.now())
  table.timestamp("update-ate").default(knex.fn.now())
}) 
  
exports.down = knex => knex.schema.dropTable("movieNotes")
  
