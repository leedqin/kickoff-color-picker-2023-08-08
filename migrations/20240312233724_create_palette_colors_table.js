exports.up = function(knex) {
    return knex.schema.createTable('palette_colors', function(table) {
        table.increments('id').primary();
        table.integer('palette_id').unsigned().notNullable();
        table.foreign('palette_id').references('id').inTable('palettes').onDelete('CASCADE');
        table.string('hex', 7).notNullable(); // For storing hexadecimal color values
        table.string('color_name').notNullable(); // Column for storing the color name
        table.string('image_bare', 2048); // URL for the bare image
        table.string('image_named', 2048); // URL for the named image
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('palette_colors');
};