const mongoose = require('mongoose');
const supertest = require('supertest');
const { app, server } = require('../index');
const api = supertest(app);
const { userDummy2 } = require('./dummyData/dummyUser');
const User = require('../models/user');
const Meeting = require('../models/meeting');
const Assistant = require('../models/assistant');
const {
  dummyMeeting,
  dummyMeetingRandomAssistant,
} = require('./dummyData/dummyMeeting');
const {
  dummyAssistant,
  dummyAssistantInMeeting,
} = require('./dummyData/dummyAssistant');

beforeEach(async () => {
  const userLogin = new User(userDummy2);
  await userLogin.save();
  const meetingExist = new Meeting(dummyMeeting);
  await meetingExist.save();
  const assistant = new Assistant(dummyAssistant);
  await assistant.save();
});

afterEach(async () => {
  await User.deleteOne({ email: userDummy2.email });
  await Meeting.deleteMany({ name: dummyMeeting.name });
  await Meeting.deleteOne({ name: 'test_meeting' });
  await Assistant.deleteMany();
});

describe('UNIT TEST for MEETING CONTROLLER ', () => {
  describe('TEST CREATE MEETING FUNCTIONALLITY', () => {
    it('should not create meeting because NAME does not exist', async () => {
      const response = await api
        .post('/api/meeting')
        .set('Authorization', userDummy2.token)
        .send({ date: dummyMeeting.date, time: dummyMeeting.time })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Name, date and time are required');
    });

    it('should not create meeting because TIME does not exist', async () => {
      const response = await api
        .post('/api/meeting')
        .set('Authorization', userDummy2.token)
        .send({ date: dummyMeeting.date, name: dummyMeeting.name })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Name, date and time are required');
    });

    it('should not create meeting because DATE does not exist', async () => {
      const response = await api
        .post('/api/meeting')
        .set('Authorization', userDummy2.token)
        .send({ time: dummyMeeting.time, name: dummyMeeting.name })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe('Name, date and time are required');
    });

    it('should not create meeting because already exist', async () => {
      const response = await api
        .post('/api/meeting')
        .set('Authorization', userDummy2.token)
        .send(dummyMeeting)
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(409);
      expect(response.body.message).toBe(
        `Assistant ${dummyMeeting.name} already exist`
      );
    });

    it('should create meeting ', async () => {
      const response = await api
        .post('/api/meeting')
        .set('Authorization', userDummy2.token)
        .send({
          name: 'test_meeting',
          time: dummyMeeting.time,
          date: dummyMeeting.date,
        })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(200);
      expect(response.body._id).toBeDefined();
    });
  });

  describe('TEST GET MEETING  FUNCTIONALLITY', () => {
    it('should not retreve meetings', async () => {
      await Meeting.deleteMany();
      const response = await api
        .get('/api/meeting')
        .set('Authorization', userDummy2.token)
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe(
        'Meetings not found, go to create one'
      );
    });

    it('should GET meetings', async () => {
      const meetings = await Meeting.find();
      const response = await api
        .get('/api/meeting')
        .set('Authorization', userDummy2.token)
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(200);
      expect(response.body.meeting).toHaveLength(meetings.length);
      expect(response.body.total).toBe(meetings.length);
    });
  });

  describe('TEST GET SINGLE MEETING FUNCTIONALLITY', () => {
    it('should retrieve a single meeting', async () => {
      const response = await api
        .get(`/api/meeting/${dummyMeeting._id}`)
        .set('Authorization', userDummy2.token)
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(200);
      expect(response.body._id).toBeDefined();
    });

    it('should not retrieve a meeting', async () => {
      const response = await api
        .get(`/api/meeting/613a48495e48540016d83cee`)
        .set('Authorization', userDummy2.token)
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe(
        `Meeting with id 613a48495e48540016d83cee could not found`
      );
    });
  });
  describe('TEST UPDATE MEETING FUNCTIONALLITY', () => {
    it('Cannot update meeting because does not exist', async () => {
      const response = await api
        .patch(`/api/meeting/613a48495e48540016d83cee`)
        .set('Authorization', userDummy2.token)
        .send({ time: '15hs' })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe(
        `Meeting with id 613a48495e48540016d83cee could not found`
      );
    });

    it('Should update meeting', async () => {
      const response = await api
        .patch(`/api/meeting/${dummyMeeting._id}`)
        .set('Authorization', userDummy2.token)
        .send({ time: '15hs' })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe(
        `Meeting ${dummyMeeting.name} was updated successfully`
      );
      expect(response.body.meeting).toBeDefined();
    });
  });

  describe('TEST DELETE MEETING FUNCTIONALLITY', () => {
    it('Cannot delete meeting because does not exist', async () => {
      const response = await api
        .delete(`/api/meeting/613a48495e48540016d83cee`)
        .set('Authorization', userDummy2.token)
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(404);
      expect(response.body.Messae).toBe(
        `Meeting with id 613a48495e48540016d83cee could not found`
      );
    });

    it('Should delete meeting ', async () => {
      const response = await api
        .delete(`/api/meeting/${dummyMeeting._id}`)
        .set('Authorization', userDummy2.token)
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(200);
      expect(response.body.Message).toBe(
        `Meeting ${dummyMeeting.name} was deleted successfuly`
      );
    });
  });

  describe('TEST DELETE ASSISTANT FROM MEETING FUNCTIONALLITY', () => {
    it("Fail because there is not assistant's NAME", async () => {
      const response = await api
        .delete(`/api/meeting/`)
        .set('Authorization', userDummy2.token)
        .send({ meeting: dummyMeeting.name })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        'You must specify the *NAME* of the assistant and the name of de *MEETING*'
      );
    });

    it("Fail because there is not MEETING's name", async () => {
      const response = await api
        .delete(`/api/meeting/`)
        .set('Authorization', userDummy2.token)
        .send({ name: dummyAssistant.name })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        'You must specify the *NAME* of the assistant and the name of de *MEETING*'
      );
    });

    it('Fail because Assistant does not exist', async () => {
      const response = await api
        .delete(`/api/meeting/`)
        .set('Authorization', userDummy2.token)
        .send({ name: 'ricardinho', meeting: dummyMeeting.name })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe(
        `The assistant ricardinho could not be found`
      );
    });

    it('Fail because Meeting does not exist', async () => {
      const response = await api
        .delete(`/api/meeting/`)
        .set('Authorization', userDummy2.token)
        .send({ name: dummyAssistant.name, meeting: 'meeting_test' })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe(
        `The meeting meeting_test could not be found`
      );
    });

    it('Fail because there is not assistants IN meeting', async () => {
      const meeting = new Meeting(dummyMeetingRandomAssistant);
      await meeting.save();
      const response = await api
        .delete(`/api/meeting/`)
        .set('Authorization', userDummy2.token)
        .send({
          name: dummyAssistant.name,
          meeting: dummyMeetingRandomAssistant.name,
        })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe(
        `${dummyAssistant.name} does not belong to this meeting`
      );
      await Meeting.deleteMany();
    });

    it('Should delete assistant from meeting', async () => {
      //creamos el participante
      const participant = new Assistant(dummyAssistantInMeeting);
      await participant.save();
      //creamos la reunion con participantes
      const meeting = new Meeting(dummyMeetingRandomAssistant);
      await meeting.save();

      const response = await api
        .delete(`/api/meeting/`)
        .set('Authorization', userDummy2.token)
        .send({
          name: dummyMeetingRandomAssistant.assistants[0].name,
          meeting: dummyMeetingRandomAssistant.name,
        })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe(
        `${dummyAssistantInMeeting.name} was deleted from ${dummyMeetingRandomAssistant.name}`
      );

      await Meeting.deleteMany();
      await Assistant.deleteMany();
    });
  });

  describe('TEST ADD ASSISTANT TO MEETING FUNCTIONALLITY', () => {
    it("Fail because there is not MEETING's name", async () => {
      const response = await api
        .post('/api/meeting/add')
        .set('Authorization', userDummy2.token)
        .send({ assistant: dummyAssistant.name })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        '*MEETING* and *ASSISTANT* are required'
      );
    });

    it("Fail because there is not ASSISTANT's name", async () => {
      const response = await api
        .post('/api/meeting/add')
        .set('Authorization', userDummy2.token)
        .send({ meeting: dummyMeeting.name })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        '*MEETING* and *ASSISTANT* are required'
      );
    });

    it('Fail because assistant does not exist', async () => {
      const response = await api
        .post('/api/meeting/add')
        .set('Authorization', userDummy2.token)
        .send({ meeting: dummyMeeting.name, assistant: 'rigoberto' })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe(
        `Assistant 'rigoberto' could not be found`
      );
    });

    it('fails because not all participants exist', async () => {
      const response = await api
        .post('/api/meeting/add')
        .set('Authorization', userDummy2.token)
        .send({
          meeting: dummyMeeting.name,
          assistant: `rigoberto,${dummyAssistant.name}`,
        })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe(
        'There was an error requesting Assistants'
      );
    });

    it('fails because meeting does not exist', async () => {
      const response = await api
        .post('/api/meeting/add')
        .set('Authorization', userDummy2.token)
        .send({
          meeting: 'dummyMeeting',
          assistant: `${dummyAssistant.name}`,
        })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe(
        `The meeting dummyMeeting could not be found`
      );
    });

    it('Fails because assistants exceed the established limit', async () => {
      //creamos un asistente
      const participant = new Assistant(dummyAssistantInMeeting);
      await participant.save();

      const response = await api
        .post('/api/meeting/add')
        .set('Authorization', userDummy2.token)
        .send({
          meeting: dummyMeeting.name,
          assistant: `${dummyAssistant.name}, ${dummyAssistantInMeeting.name}`,
        })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toBe(
        'the limit number of people for the meeting has reached its limit'
      );
    });

    it('Should add assistant to meeting', async () => {
      const response = await api
        .post('/api/meeting/add')
        .set('Authorization', userDummy2.token)
        .send({ meeting: dummyMeeting.name, assistant: dummyAssistant.name })
        .expect('Content-Type', /application\/json/);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe(
        `Assistants was added to meeting successfully`
      );
    });
  });
});

afterAll(async () => {
  server.close();
  mongoose.connection.close();
});
