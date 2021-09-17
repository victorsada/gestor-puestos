const supertest = require('supertest');
const mongoose = require('mongoose');
const Assistant = require('../models/assistant');
const User = require('../models/user');
const { app, server } = require('../index');
const api = supertest(app);
const { userDummy2 } = require('./dummyData/dummyUser');
const { dummyAssistant } = require('./dummyData/dummyAssistant');

beforeEach(async () => {
  const userLogin = new User(userDummy2);
  await userLogin.save();
  const assistantExist = new Assistant(dummyAssistant);
  await assistantExist.save();
  await Assistant.deleteOne({ name: 'ricardinho' });
});

afterEach(async () => {
  await User.deleteOne({ email: userDummy2.email });
  await Assistant.deleteOne({ _id: dummyAssistant._id });
});

describe('Unit test for ASSISTANT CONTROLLER', () => {
  describe('TEST CREATE ASSISTANT FUNCTIONALLITY', () => {
    it('should not create assistant because name does not exist', async () => {
      const response = await api
        .post('/api/assistant/')
        .set('Authorization', userDummy2.token)
        .send({ email: 'correo@corre.com' })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Name is required');
    });

    it('should not create assistant because sex is invalid', async () => {
      const response = await api
        .post('/api/assistant/')
        .set('Authorization', userDummy2.token)
        .send({ sex: 'no binario', name: 'gustav' })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        'Sex must be "Masculino or Femenino" '
      );
    });

    it('should not create assistant because already exist', async () => {
      const response = await api
        .post('/api/assistant/')
        .set('Authorization', userDummy2.token)
        .send({ name: dummyAssistant.name })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(409);
      expect(response.body.message).toBe(
        `Assistant ${dummyAssistant.name} already exist`
      );
    });

    it('should create assistant', async () => {
      const response = await api
        .post('/api/assistant/')
        .set('Authorization', userDummy2.token)
        .send({ name: 'ricardinho' })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(200);
      expect(response.body._id).toBeDefined();
    });
  });

  describe('TEST GET ASSISTANTS FUNCTIONALLITY', () => {
    it('should retrieve assistants', async () => {
      const assistants = await Assistant.find();
      const response = await api
        .get('/api/assistant/')
        .set('Authorization', userDummy2.token)
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(assistants.length);
    });

    it('should not retrieve assistants', async () => {
      await Assistant.deleteMany();
      const response = await api
        .get('/api/assistant/')
        .set('Authorization', userDummy2.token)
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe(
        'No assistent found, go to create one!'
      );
    });
  });

  describe('TEST GET SINGLE ASSISTANT FUNCTIONALLITY', () => {
    it('should not retrieve assistant', async () => {
      const response = await api
        .get('/api/assistant/613941b8f0be970016358286')
        .set('Authorization', userDummy2.token)
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Assistant not found');
    });

    it('should retrieve a single assistant', async () => {
      const response = await api
        .get(`/api/assistant/${dummyAssistant._id}`)
        .set('Authorization', userDummy2.token)
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(200);
      expect(response.body._id).toBeDefined();
    });
  });

  describe('TEST UPDATE ASSISTANT FUNCTIONALLITY', () => {
    it('Cannot update assistant because is already exist', async () => {
      const response = await api
        .patch(`/api/assistant/${dummyAssistant._id}`)
        .set('Authorization', userDummy2.token)
        .send({ name: dummyAssistant.name })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(409);
      expect(response.body.message).toBe(
        `Assistant ${dummyAssistant.name} is already exist`
      );
    });

    it('should not update assistant because does not exist', async () => {
      const response = await api
        .patch('/api/assistant/613941b8f0be970016358286')
        .set('Authorization', userDummy2.token)
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Assistant not found.');
    });

    it('should update assistant', async () => {
      const response = await api
        .patch(`/api/assistant/${dummyAssistant._id}`)
        .set('Authorization', userDummy2.token)
        .send({ telf: '5555' })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe(
        `Assistant ${dummyAssistant.name} was updated successfully`
      );
    });
  });

  describe('TEST DELETE ASSISTANT FUNCTIONALLITY', () => {
    it('should delete assistant', async () => {
      const response = await api
        .delete(`/api/assistant/${dummyAssistant._id}`)
        .set('Authorization', userDummy2.token)
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(200);
      expect(response.body.Message).toBe(
        `Assistant ${dummyAssistant.name} was deleted successfully`
      );
    });

    it('Cannot delete assistant because does not exist', async () => {
      const response = await api
        .delete(`/api/assistant/613941b8f0be970016358286`)
        .set('Authorization', userDummy2.token)
        .send({ name: dummyAssistant.name })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(404);
      expect(response.body.msg).toBe('Assistant not found');
    });
  });
});

afterAll(async () => {
  server.close();
  mongoose.connection.close();
});
