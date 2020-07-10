import { createPool, Pool, MysqlError, FieldInfo } from 'mysql';
import { Observable } from 'rxjs';

import { IMySQLInsertResponse } from '../interfaces/mysql.insert.response.interface';

export class DatabaseService {
    pool: Pool = createPool({
        host: '162.209.65.225',
        user: 'root',
        password: 'Mbgfi23g!!@',
        database: 'veracheck2'
    });

    select(
        statement: string,
        values?: Array<any>,
        pool: Pool = this.pool
    ): Observable<{
        results?: Array<any>;
        fields?: FieldInfo[];
    }> {
        return Observable.create(observer => {
            pool.query(
                statement,
                values,
                (error: MysqlError, results?: any, fields?: FieldInfo[]) => {
                    if (error) {
                        observer.error(error);
                    } else {
                        observer.next({
                            results: results[0],
                            fields: fields
                        });
                    }
                    observer.complete();
                }
            );
        });
    }

    insert(
        statement: string,
        values?: Array<any>,
        pool: Pool = this.pool
    ): Observable<IMySQLInsertResponse> {
        return Observable.create(observer => {
            pool.query(
                statement,
                values,
                (error: MysqlError, results?: any) => {
                    if (error) {
                        observer.error(error);
                    } else {
                        observer.next(
                            new DatabaseService().insertResponseHandler(results)
                        );
                    }
                    observer.complete();
                }
            );
        });
    }

    /**
     *
     * @param results
     */
    insertResponseHandler(results) {
        if (Array.isArray(results) && results[0][0] && results[0][0].insertId) {
            results[1].insertId = results[0][0].insertId;
            return { ...results[1] };
        } else {
            return { ...results };
        }
    }
}

export default new DatabaseService();
