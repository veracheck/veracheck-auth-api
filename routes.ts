import { Application } from 'express';

import authRouter from './api/v3/controllers/auth';
import resourceRouter from './api/v3/controllers/resources';

export default function routes(app: Application): void {
    app.use('/api/v3/auth', authRouter);
    app.use('/api/v3/resources', resourceRouter);
}
