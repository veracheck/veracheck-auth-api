import express from 'express';
import resource from './controller'
export default express.Router()
    .post('/states', resource.states)