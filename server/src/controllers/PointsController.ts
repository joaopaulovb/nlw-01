import { Request, Response} from 'express';
import knex from '../database/connection';

class PointsController {
    async index(request: Request, response: Response) {
        const {
            city,
            state,
            items
        } = request.query;

        const parsedItems = String(items).split(',').map(item => Number(item.trim()));

        const points = await knex('points')
        .join('point_items', 'points.point_id', '=', 'point_items.point_id')
        .where((conditionalQuery) => {
            if (parsedItems.length > 0) {
                conditionalQuery.whereIn('point_items.item_id', parsedItems)
            }
            if (city) {
                conditionalQuery.where('points.city', String(city))
            }
            if (state) {
                conditionalQuery.where('points.state', String(state))
            }
        })
        .distinct()
        .select('points.*');

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.43.21:3333/uploads/${point.image}`
            };
        });

        return response.json(serializedPoints);
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('point_id', id).first();

        if (!point) {
            return response.status(400).json({message: 'Point not found'});
        }

        const items = await knex('items')
        .join('point_items', 'items.item_id', '=', 'point_items.item_id')
        .where('point_items.point_id', id)
        .select('items.title');    

        const serializedPoint = {
            ...point,
            image_url: `http://192.168.43.21:3333/uploads/${point.image}`
        };

        return response.json({ point: serializedPoint, items });
    }

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            state,
            items
        } = request.body;
    
        const trx = await knex.transaction();
        
        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            state
        };

        const newPoints = await trx('points').insert(point);

        const pointItems = items.split(',').map((item: string) => Number(item.trim())).map((item_id: number) => {
            return {
                item_id,
                point_id: newPoints[0]
            }
        });
    
        await trx('point_items').insert(pointItems);
        
        await trx.commit();

        return response.json({ 
            id: newPoints[0],
            ...point
         })
    };

    async delete(request: Request, response: Response) {
        const { id } = request.params;

        const returned = await knex('points').delete().where('points.point_id', id)

        return response.json({ success: (returned === 1) });
    }
}

export default PointsController