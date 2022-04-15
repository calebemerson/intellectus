

function tests()
{
  console = Logger;
  //sumTest();
  addStudentTest();
  makeAndRemoveRoomTest();
  sanitizerTest();
};



/*
//Templete
function sumTest()
{
    QUnit.test('two numbers', assert => {
      assert.equal(3, 3);
    });

    QUnit.test('two numbers 2', assert => {
      assert.equal(3, 5);
    });
}*/

function addStudentTest()
{
  makeRoom("test1")
  var initialStats = classStatistics("test1").split(",");
  initialStats[0] = (Number(initialStats[0]) + 1);
  initialStats[1] = (Number(initialStats[1]) + 1);
  addStudent("test1");
  var afterStats = classStatistics("test1").split(",");
  afterStats[0] = Number(afterStats[0]);
  afterStats[1] = Number(afterStats[1]);
  QUnit.test("Add 1 student to room", assert => {
    assert.equal(initialStats[0], afterStats[0]);
    assert.equal(initialStats[1], afterStats[1]);
  });
  
  var initialStats = classStatistics("test1").split(",");
  initialStats[0] = (Number(initialStats[0]) + 2);
  initialStats[1] = (Number(initialStats[1]) + 2);
  addStudent("test1");
  addStudent("test1");
  var afterStats = classStatistics("test1").split(",");
  afterStats[0] = Number(afterStats[0]);
  afterStats[1] = Number(afterStats[1]);
  QUnit.test("Add 2 students to room", assert => {
    assert.equal(initialStats[0], afterStats[0]);
    assert.equal(initialStats[1], afterStats[1]);
  });
  removeRoom("test1")
}

function makeAndRemoveRoomTest()
{
  makeRoom("abc123");
  makeRoom("abc1234");
  var stats = classStatistics("abc123").split(",");
    QUnit.test("Test Room Creation", assert => {
    assert.equal(Number(stats[0]), 0);
    assert.equal(Number(stats[1]), 0);
    assert.equal(removeRoom("abc123"),true)
  });
  
  var removedStats = classStatistics("abc123")
    QUnit.test("Test Room Removal", assert => {
    assert.equal(classStatistics("abc123"), "Error\nNo Room exists with that Room number");
    Utilities.sleep(1000);
    assert.equal(removeRoom("abc1234"),true);
    assert.equal(removeRoom("abc1234"),false);
  });
}
function sanitizerTest()
{
    QUnit.test("Input Sanitation Test", assert => {
    assert.equal(inputSanitation("abc123","roomName"), true );
    assert.equal(inputSanitation("sandwich1","roomName"), true );
    assert.equal(inputSanitation("asdf1234QWER","roomName"), false );
    assert.equal(inputSanitation("!;","roomName"), false );
    assert.equal(inputSanitation("!a;","roomName"), false );
  });

    QUnit.test("Function Sanitation Test", assert => {
    assert.equal(classStatistics("[]<>;"), "Error\nBad room name" );
    assert.equal(makeRoom("[]<>;"), false );
    assert.equal(removeRoom("[]<>;"), false );
    assert.equal(addStudent("[]<>;"), "Error\nBad room name");
  });
}

