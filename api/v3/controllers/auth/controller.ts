import { Request, Response } from 'express';
import { map } from 'rxjs/operators';

import path from 'path';
import { readFile, readFileSync } from 'fs';
import jwt from 'jsonwebtoken';

import database from '../../services/database.service';

import { IAuthState } from '@library/interfaces/authentication.state.interface';
import { IMySQLInsertResponse } from '../../interfaces/mysql.insert.response.interface';

/**
 *
 */
export class AuthController {
    constructor() {}

    /**
     *
     * @param req
     * @param res
     */
    login(req: Request, res: Response): void {
        const file = path.resolve(__dirname + '/sql/login.sql');

        readFile(file, 'utf8', (error, statement) => {
            error !== null
                ? res.json(error)
                : database
                      .select(statement, [req.body.username, req.body.password])
                      .pipe(
                          map(data =>
                              data.results.length > 0
                                  ? new AuthController().loginSuccess({
                                        ...data.results[0]
                                    })
                                  : new AuthController().loginFailure()
                          )
                      )
                      .subscribe(
                          data => {
                              res.json(data);
                          },
                          error => {
                              res.json({
                                  online: false,
                                  error: { login: error }
                              });
                          },
                          () => {
                              console.log('(complete)');
                          }
                      );
        });
    }

    /**
     *
     * @param user
     */
    loginSuccess(user): IAuthState {
        return {
            online: true,
            user,
            token: this.createJsonWebToken(user)
        };
    }

    /**
     *
     */
    loginFailure(): IAuthState {
        return {
            online: false,
            error: { login: 'Invalid Credentials!' }
        };
    }

    /**
     *
     * @param req
     * @param res
     */
    logout(req: Request, res: Response) {
        const file = path.resolve(__dirname + '/sql/logout.sql');

        readFile(file, 'utf8', (error, statement) => {
            error !== null
                ? res.json(error)
                : database
                      .select(statement, [req.body.username, req.body.password])
                      .pipe(
                          map(data =>
                              data.results[0].length > 0 ? true : false
                          )
                      )
                      .subscribe(
                          data => {
                              res.json(data);
                          },
                          error => {
                              res.json({ error: { logout: error } });
                          },
                          () => {
                              console.log('(complete)');
                          }
                      );
        });
    }

    /**
     *
     * @param req
     * @param res
     */
    register(req: Request, res: Response) {
        const file = path.resolve(__dirname + '/sql/register.sql');

        readFile(file, 'utf8', (error, statement) => {
            error !== null
                ? res.json(error)
                : database
                      .insert(statement, [
                          req.body.contact.contact,
                          req.body.contact.email,
                          req.body.contact.phone,
                          req.body.contact.address.street1,
                          req.body.contact.address.street2,
                          req.body.contact.address.city,
                          req.body.contact.address.state,
                          req.body.contact.address.zip,
                          req.body.company.name,
                          req.body.company.unit,
                          req.body.company.type,
                          req.body.ap.contact,
                          req.body.ap.email,
                          req.body.ap.phone
                      ])
                      .pipe(
                          map((data: IMySQLInsertResponse) => {
                              return data.insertId > 0 ? true : false;
                          })
                      )
                      .subscribe(
                          data => {
                              res.json(data);
                          },
                          error => {
                              res.json({ error: { register: error } });
                          },
                          () => {
                              console.log('(complete)');
                          }
                      );
        });
    }

    passwordRecovery(req: Request, res: Response) {
        const file = path.resolve(__dirname + '/sql/password.recovery.sql');

        readFile(file, 'utf8', (error, statement) => {
            error !== null
                ? res.json(error)
                : database
                      .select(statement, [req.body.email])
                      .pipe(
                          map(data =>
                              data.results.length > 0
                                  ? new AuthController().passwordRecoverySuccess(
                                        {
                                            ...data.results[0]
                                        }
                                    )
                                  : new AuthController().passwordRecoveryFailure()
                          )
                      )
                      .subscribe(
                          data => {
                              res.json(data);
                          },
                          error => {
                              res.json({ error: { passwordRecovery: error } });
                          },
                          () => {
                              console.log('(complete)');
                          }
                      );
        });
    }

    passwordRecoverySuccess(user) {
        return {
            passwordRecovery: true
        };
    }

    passwordRecoveryFailure() {
        return {
            passwordRecovery: false,
            error: { passwordRecovery: 'Could not find account!' }
        };
    }

    /**
     *
     * @param token
     */
    isLoggedIn(token) {
        return (
            Math.floor(Date.now() / 1000) < this.decodeJsonWebToken(token).exp
        );
    }

    /**
     *
     * @param packet
     */
    private createJsonWebToken(packet) {
        return jwt.sign(
            { data: packet },
            readFileSync(path.resolve(__dirname + '/key')),
            {
                expiresIn: '8h',
                algorithm: 'HS512'
            }
        );
    }

    /**
     *
     * @param token
     */
    private decodeJsonWebToken(token) {
        return jwt.verify(
            token,
            readFileSync(path.resolve(__dirname + '/key'))
        );
    }
}

export default new AuthController();
