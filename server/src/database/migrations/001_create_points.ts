import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('points', table => {
        table.increments('point_id').primary();
        table.string('image').notNullable;
        table.string('name').notNullable;
        table.string('email').notNullable;
        table.string('whatsapp').notNullable;
        table.decimal('latitude');
        table.decimal('longitude');
        table.string('city');
        table.string('state');
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('point');
}