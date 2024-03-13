exports.up = function(knex) {
    return knex.schema.createTable('palettes', function(table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.text('colors').nullable();
    });
};

exports.down = function(knex) {
    return knex.schema.table('palettes', function(table) {
        table.dropColumn('colors');
    });
};