const dummyMeeting = {
  _id: '613a48496e48540016d83cee',
  name: 'reunion 1',
  date: '2021-09-01T00:00:00.000Z',
  time: '16:30hs',
  amountPeople: 1,
  assistants: [],
};

const dummyMeetingRandomAssistant = {
  assistants: [
    {
      _id: '613941e4f0ce970016358296',
      name: 'jose',
    },
    {
      _id: '61436834e3039b0016b7f920',
      name: 'rocco',
    },
    {
      _id: '6143680fe3039b0016b7f918',
      name: 'sol',
    },
    {
      _id: '713941b8f0ce970016358286',
      name: 'victorinox',
    },
    {
      _id: '613941d0f0ce97001635828e',
      name: 'salomon',
    },
  ],
  _id: '613a48496e48540016d83cea',
  name: 'reunion 2',
  date: '2021-09-01T00:00:00.000Z',
  time: '16:30hs',
  amountPeople: 5,
  createdAt: '2021-09-09T17:45:45.211Z',
  updatedAt: '2021-09-16T16:35:48.446Z',
};

module.exports = {
  dummyMeeting,
  dummyMeetingRandomAssistant,
};
