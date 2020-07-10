import express from 'express';
import auth from './controller';
export default express
  .Router()
  .post('/login', auth.login)
  .post('/logout', auth.logout)
  .post('/register', auth.register)
  .post('/passwordRecovery', auth.passwordRecovery);
