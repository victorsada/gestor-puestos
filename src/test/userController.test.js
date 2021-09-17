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
} = require('./dummyData/mockUser');

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
      expect(response.body.name).toBeUndefined();
    });

    it('should not create a user beacuse there is not email', async () => {
      const response = await api
        .post('/api/user')
        .send(userDummyWithOutEmail)
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(400);
      expect(response.body.email).toBeUndefined();
    });

    it('should not create a user beacuse there is not password', async () => {
      const response = await api
        .post('/api/user')
        .send(userDummyWithOutPassword)
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(400);
      expect(response.body.password).toBeUndefined();
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
      expect(response.body.email).toBeUndefined();
    });

    it('should not login because password is missing', async () => {
      const response = await api
        .post('/api/user/login')
        .send(userDummyWithOutPassword)
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(400);
      expect(response.body.password).toBeUndefined();
    });

    it('should not login beacause email is wrong', async () => {
      const response = await api
        .post('/api/user/login')
        .send({ email: 'loquesea@loquesea.com', password: userDummy2.password })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('User not exist');
    });

    it('should not login beacuse password is wrong', async () => {
      const response = await api
        .post('/api/user/login')
        .send({ email: userDummy2.email, password: 'loquesea' })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(409);
      expect(response.body.message).toBe('Password incorrect');
    });

    it('should login user', async () => {
      const response = await api
        .post('/api/user/login')
        .send({ email: userDummy2.email, password: '123456789' })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBeDefined();
    });
  });
  describe('GET user functionallity', () => {
    it('should get users', async () => {
      const users = await User.find();
      const response = await api
        .get('/api/user')
        .set('Authorization', userDummy2.token);
      expect(response.statusCode).toBe(200);
      expect(response.body.user).toHaveLength(users.length);
    });
  });
  describe('UPDATE user functionallity', () => {
    it('should not update user beacause email can not be modified', async () => {
      const response = await api
        .patch(`/api/user/${userDummy2._id}`)
        .set('Authorization', userDummy2.token)
        .expect('Content-Type', /application\/json/)
        .send(userDummy2);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Email cannot be changed');
    });

    it('should not update user beacuse user does not exist', async () => {
      const response = await api
        .patch('/api/user/61281fe18b7d4d39e87e542e')
        .set('Authorization', userDummy2.token)
        .expect('Content-Type', /application\/json/)
        .send({ password: 'jose' });
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should update user', async () => {
      const response = await api
        .patch(`/api/user/${userDummy2._id}`)
        .set('Authorization', userDummy2.token)
        .expect('Content-Type', /application\/json/)
        .send({ password: 'new password' });
      expect(response.statusCode).toBe(201);
      expect(response.body.password).toBeDefined();
      expect(response.body.message).toBeUndefined();
    });
  });
  describe('DELETE user functionallity', () => {
    it('should not delete user beacuse does not exist', async () => {
      const response = await api
        .delete('/api/user/61281fe18b7d4d39e87e542e')
        .set('Authorization', userDummy2.token);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should delete user', async () => {
      const response = await api
        .delete(`/api/user/${userDummy2._id}`)
        .set('Authorization', userDummy2.token);
      expect(response.statusCode).toBe(200);
      expect(response.body.msg).toBe(
        `User ${userDummy2.name} was deleted successfully`
      );
    });
  });
  describe('LOGOUT functionallity', () => {
    it('User should logout', async () => {
      const response = await api
        .post('/api/user/logout')
        .set('Authorization', userDummy2.token);
      expect(response.statusCode).toBe(200);
      expect(response.body.msg).toBe(`User ${userDummy2.name} is logout`);
    });
  });
});

afterAll(async () => {
  server.close();
  mongoose.connection.close();
});
