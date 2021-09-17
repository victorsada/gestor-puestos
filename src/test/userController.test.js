const supertest = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/user');
const { app, server } = require('../index');
const api = supertest(app);
const {
  userDummy,
  userDummyWithOutEmail,
  userDummyWithOutPassword,
  userDummy2,
} = require('./mockUser');

beforeEach(async () => {
  await User.deleteOne({ email: 'ajgrGOrkhorkHRhorkh@Gapgiojkdfgkf.com' });
  const userExist = new User(userDummy);
  await userExist.save();
  const userLogin = new User(userDummy2);
  await userLogin.save();
});

afterEach(async () => {
  await User.deleteOne({ email: userDummy2.email });
  await User.deleteOne({ email: userDummy.email });
});

describe('Unit test for USER CONTROLLER', () => {
  describe('Test Create User Functionallity', () => {
    it('should create a user', async () => {
      const response = await api
        .post('/api/user')
        .send({
          name: 'javier',
          email: 'ajgrGOrkhorkHRhorkh@Gapgiojkdfgkf.com',
          password: '1234',
        })
        .expect('Content-Type', /application\/json/);

      expect(response.statusCode).toBe(201);
    });
    it('should not create a user beacuse there is not name', async () => {
      const response = await api
        .post('/api/user')
        .send({
          email: 'a@a.com',
          password: '1234',
        })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(400);
      expect(response.body.name).toBe(undefined);
    });

    it('should not create a user beacuse there is not email', async () => {
      const response = await api
        .post('/api/user')
        .send(userDummyWithOutEmail)
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(400);
      expect(response.body.email).toBe(undefined);
    });

    it('should not create a user beacuse there is not password', async () => {
      const response = await api
        .post('/api/user')
        .send(userDummyWithOutPassword)
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(400);
      expect(response.body.password).toBe(undefined);
    });

    it('should not create a user beacuse USER already exist', async () => {
      const response = await api
        .post('/api/user')
        .send(userDummy)
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(409);
    });
  });
  describe('Test login functionallity', () => {
    it('should not login because email is missing', async () => {
      const response = await api
        .post('/api/user/login')
        .send(userDummyWithOutEmail)
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(400);
      expect(response.body.email).toBe(undefined);
    });

    it('should not login because password is missing', async () => {
      const response = await api
        .post('/api/user/login')
        .send(userDummyWithOutPassword)
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(400);
      expect(response.body.password).toBe(undefined);
    });

    //que el email no exista
    //que la password sea incorrecto
    //que todo vaya ok (200)
  });
  describe('GET user functionallity', () => {
    //que no hayan usuarios
    //OK
  });
  describe('UPDATE user functionallity', () => {
    //no puede actualizar email
    // que no haya un usuario
    //OK
  });
  describe('DELETE user functionallity', () => {
    //que no exista el usuario
    //OK
  });
  describe('LOGOUT functionallity', () => {
    //ok
  });
});

afterAll(async () => {
  server.close();
  mongoose.connection.close();
});
