 function doGet(e) {
  var testing = false;
  if(testing)
  {
    QUnit.urlParams( e.parameter );
    QUnit.config({
      title: "QUnit for Google Apps Script - Test suite"
    });
    QUnit.load( tests );
    return QUnit.getHtml();
  }
  else
  {
    //Short circuit evaluation
    if(e === undefined || e.parameters["page"] === undefined)
    {
      return HtmlService.createHtmlOutputFromFile("HomePage");
    }
    var page = e.parameters["page"];
    if(page == "StudentPage")
    {
      if(e === undefined || e.parameters["ClassID"] === undefined || !isRoom(e.parameters["ClassID"]))
      {
        return HtmlService.createHtmlOutputFromFile("HomePage");
      }
      else
      {
        return HtmlService.createHtmlOutputFromFile("StudentPage");

      }
    }
    return HtmlService.createHtmlOutputFromFile(page);
  }
}


/**
 * Adds 1 to "total student" and "total understanding students" column of 
 * the touple with the given room number
 */
function addStudent(room)
{
  if(!inputSanitation(room))
  {
    return "Error\nBad room name"
  }

  var sheet = getSheet();
  var cellRange = getRange(room);

  if(cellRange == null)
  {
    return "Error\nNo Room exists with that Room number";
  }
  var rowIndex = cellRange.getRow();
  var understand = sheet.getRange(rowIndex,"2");
  var total = sheet.getRange(rowIndex,"3");
  //understand.setValue(understand.getValue()+1);
  //total.setValue(total.getValue()+1);
  queueFunction("understandInc",room);
  //Utilities.sleep(1000);
  queueFunction("totalInc",room);
}

function removeStudent(room,isUnderstand)
{

  if(!inputSanitation(room))
  {
    return "Error\nBad room name"
  }

  var sheet = getSheet();
  var cellRange = getRange(room);

  if(cellRange == null)
  {
    return "Error\nNo Room exists with that Room number";
  }
  var rowIndex = cellRange.getRow();
  var understand = sheet.getRange(rowIndex,"2");
  var total = sheet.getRange(rowIndex,"3");
  if(isUnderstand)
  {
    queueFunction("understandDec",room);
  }
  queueFunction("totalDec",room);

}

/**
 * Returns a string with number of understanding students and number of total students
 */
function classStatistics(room)
{
  if(!inputSanitation(room))
  {
    return "Error\nBad room name"
  }

  var sheet = getSheet();
  var cellRange = getRange(room);

  if(cellRange === null)
  {
    return "Error\nNo Room exists with that Room number";
  }
  var rowIndex = cellRange.getRow();
  var understand = sheet.getRange(rowIndex,"2");
  var total = sheet.getRange(rowIndex,"3");
  return (understand.getValue()+","+total.getValue())
}

function changeClassStats(room,understand)
{
  var sheet = getSheet();
  var cellRange = getRange(room);

  if(cellRange == null)
  {
    return false;
  }
  var rowIndex = cellRange.getRow();
  var understandNum = sheet.getRange(rowIndex,"2");
  if(understand)
  {
    queueFunction("understandInc",room);
  }
  else
  {
    queueFunction("understandDec",room);
  }

  return true;
}

function test()
{
  makeRoom(12345);
}
/**
 * Returns true if the room is a valid room name and it is not already in the database, otherwise false;
 */
function makeRoom(candidateRoom)
{
  if(!inputSanitation(candidateRoom))
  {
    return false;
  }

  var sheet = getSheet();
  var cellRange = getRange(candidateRoom);
  var thing = null;
  if(cellRange === null)
  {
    sheet.appendRow([candidateRoom,0,0]);
    return true;
  }
  else
  {
    return false;
  }
}

/**
 * Returns true if the room is a valid room name and it is in the database already, otherwise false
 */
function removeRoom(room)
{
  if(!inputSanitation(room))
  {
    return false;
  }

  var sheet = getSheet();
  var cellRange = getRange(room);
  if(cellRange === null)
  {
     return false;
  }
  else
  {
    var rowIndex = cellRange.getRow();
    var touple = sheet.getRange(rowIndex,1,1,3);
    touple.deleteCells(SpreadsheetApp.Dimension.ROWS);
    return true;
  }
}
/**
 * Determines if a room number is active
 */
function isRoom(room)
{
  return(getRange(room)!=null);
}

function spreadSheetFunction(func,roomID)
{
  var cellRange = getRange(roomID);
  var sheet = getSheet();
  var rowIndex = cellRange.getRow();
  switch(func) 
  {
    case "understandInc":
      var understand = sheet.getRange(rowIndex,"2");
      understand.setValue(understand.getValue()+1)
      break;
    case "understandDec":
      var understand = sheet.getRange(rowIndex,"2");
      understand.setValue(understand.getValue()-1)
      break;
    case "totalDec":
      var total = sheet.getRange(rowIndex,"3");
      total.setValue(total.getValue()-1)
      break
    case "totalInc":
      var total = sheet.getRange(rowIndex,"3");
      total.setValue(total.getValue()+1)
      break
    default:
      return;
  }
}
/**
 * All functions that are timing sensitive(may cause race hazards) are placed in a queue
 * Queues only block functions that are of the same roomID
 * The function will poll on whether there is an active function,
 * if not, the cache will indicate an active function and the function will be given
 * 2 seconds to finish
 * 
 * This function must be asynchronous to ensure functions calling this do not timeout
 */
async function queueFunction(func,roomID)
{
  var cache = CacheService.getScriptCache();
  var last = cache.get(roomID);
  if (last  != null) {
    Utilities.sleep(1000);
    queueFunction(func,roomID);
  }
  else
  {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);
    if(!lock.hasLock)
    {
      Utilities.sleep(1000);
      queueFunction(func,roomID);
    }
    else
    {
      cache.put(roomID, '_', 2);
      //SpreadsheetApp.flush();
      spreadSheetFunction(func,roomID);
    }
  }
}


function getSheet()
{
    var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Mh9KF8Sa6Sa_lCBTEF4CF8fCxEqLVQqoPSKKazofK6M/edit#gid=0");
  var sheet = ss.getSheets()[0];
  return sheet;
}
function getRange(room)
{
    var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Mh9KF8Sa6Sa_lCBTEF4CF8fCxEqLVQqoPSKKazofK6M/edit#gid=0");
  var sheet = ss.getSheets()[0];
  var cellRange = sheet.createTextFinder(room).matchEntireCell(true).findNext();
  return cellRange;
}
/**
 * Returns whether or not the given input is allowed using a given rule
 * Rules: roomName (Must be a number that is less than 10 digits long)
 */
function inputSanitation(input, rule)
{
  if(input === "")
  {
    return false;
  }
  var regexRule;
  if(rule == "roomName" || rule == null || rule == "")
  {
    if(input.length > 10)
    {
      return false;
    }
    regexRule = new RegExp(["([a-zA-Z0-9])"])
  }
  for(var i = 0;i < input.length; ++i)
  {
    if(!regexRule.test(input[i]))
    {
      return false;
    }
  }
  return true;
}