import { Request, Response } from 'express';
import { map } from 'rxjs/operators';

import path from 'path';
import { readFile } from 'fs';

import database from '../../services/database.service';

/**
 *
 */
export class ResourceController {
    constructor() {}

    /**
     *
     * @param req
     * @param res
     */
    states(req: Request, res: Response): void {
        const { select } = req.body;
        
        let file = path.resolve(__dirname + '/sql/states_All.sql');
        switch (true) {
            case select:
                file = path.resolve(
                    __dirname + '/sql/states_SelectOptions.sql'
                );
                break;
        }

        readFile(file, 'utf8', (error, statement) => {
            error !== null
                ? res.json(error)
                : database
                      .select(statement, [])
                      .pipe(
                          map(data => [
                              { value: '', label: '' },
                              ...data.results
                          ])
                      )
                      .subscribe(
                          data => res.json(data),
                          error => res.json(error),
                          () => {
                              console.log('(complete)');
                          }
                      );
        });
    }
}

export default new ResourceController();
