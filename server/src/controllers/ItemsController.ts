import { Request, Response} from 'express';
import knex from '../database/connection';

class ItemsController {
    async index(request: Request, response: Response) {
        const items = await knex('items').select('*');
    
        return response.json(items.map(item => {
            return {
                item_id: item.item_id,
                title: item.title,
                image_url: `http://192.168.43.21:3333/uploads/${item.image}`
            }
        }));
    }
}

export default ItemsController;