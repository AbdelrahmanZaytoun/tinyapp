const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('email >>>> user', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.equal(user, testUsers.userRandomID)
    // Write your assert statement here
  })

  it('no matching email >>> undefined', () => {
    const user = getUserByEmail('ghostperson@example.com', testUsers);
    assert.equal(user, undefined);
  });
});
