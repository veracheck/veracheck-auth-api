import 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import Server from '../../../../index';

describe('Authentication', () => {
    it('should be started', done => {
        request(Server)
            .get('/')
            .expect(200, done);
    });
    it('should authenticate', async () => {
        await request(Server)
            .post('/api/v3/auth/login')
            .send({ username: 'admin', password: '0414' })
            .expect('Content-Type', 'application/json; charset=utf-8')
            .then(response => {
                expect(response.body).to.be.a('string');
            });
    });
    it('should not authenticate', async () => {
        await request(Server)
            .post('/api/v3/auth/login')
            .send({ username: 'admin', password: '0410' })
            .expect('Content-Type', 'application/json; charset=utf-8')
            .then(response => {
                expect(response.body).to.be.false;
            });
    });
    it('should logout', async () => {
        await request(Server)
            .post('/api/v3/auth/logout')
            .send({ username: 'admin', password: '0414' })
            .expect('Content-Type', 'application/json; charset=utf-8')
            .then(response => {
                expect(response.body).to.be.true;
            });
    });
    it('should not logout', async () => {
        await request(Server)
            .post('/api/v3/auth/logout')
            .send({ username: 'admin', password: '0410' })
            .expect('Content-Type', 'application/json; charset=utf-8')
            .then(response => {
                expect(response.body).to.be.false;
            });
    });
});
