const userDummy = {
  name: 'diego',
  password: '1234',
  email: 'exist@exist.com',
};

const userDummyWithOutEmail = {
  name: 'diego',
  password: '1234',
};

const userDummyWithOutPassword = {
  name: 'diego',
  email: 'a@a.com',
};

const userDummy2 = {
  rol: 'admin',
  _id: '61281fe18b7f4d39e87e542e',
  email: 'victor@api.com',
  name: 'victor',
  password: '$2a$10$861d1vlyaLIwcaUH2hWtmexPaijACBV23de8GKdnM.1GwSGhFlR4.',
  createdAt: '2021-08-26T23:12:33.169Z',
  updatedAt: '2021-09-17T01:32:50.209Z',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTI4MWZlMThiN2Y0ZDM5ZTg3ZTU0MmUiLCJpYXQiOjE2MzE4NDIzNzB9.hlOWkmMEGuuUWoSF9drql1jELcnkNqdyQSiy8ZGNcbU',
};

module.exports = {
  userDummy,
  userDummyWithOutEmail,
  userDummyWithOutPassword,
  userDummy2,
};
