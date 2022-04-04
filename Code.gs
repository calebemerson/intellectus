 function doGet(e) {
  var testing = true;
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
    return HtmlService.createHtmlOutputFromFile(page);
  }
}


/**
 * Adds 1 to "total student" and "total understanding students" column of 
 * the touple with the given room number
 */
function addStudent(room)
{
  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Mh9KF8Sa6Sa_lCBTEF4CF8fCxEqLVQqoPSKKazofK6M/edit#gid=0");
  var sheet = ss.getSheets()[0];
  var cellRange = sheet.createTextFinder(room).matchEntireCell(true).findNext();
  if(cellRange == null)
  {
    return "Error\nNo Room exists with that Room number";
  }
  var rowIndex = cellRange.getRow();
  var understand = sheet.getRange(rowIndex,"2");
  var total = sheet.getRange(rowIndex,"3");
  understand.setValue(understand.getValue()+1);
  total.setValue(total.getValue()+1);

}

/**
 * Returns a string with number of understanding students and number of total students
 */
function classStatistics(room)
{
  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Mh9KF8Sa6Sa_lCBTEF4CF8fCxEqLVQqoPSKKazofK6M/edit#gid=0");
  var sheet = ss.getSheets()[0];
  var cellRange = sheet.createTextFinder(room).matchEntireCell(true).findNext();
  if(cellRange === null)
  {
    return "Error\nNo Room exists with that Room number";
  }
  var rowIndex = cellRange.getRow();
  var understand = sheet.getRange(rowIndex,"2");
  var total = sheet.getRange(rowIndex,"3");
  return (understand.getValue()+","+total.getValue())
}
/**
 * Returns true if the room is not already in the database, otherwise false;
 */
function makeRoom(candidateRoom)
{
  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Mh9KF8Sa6Sa_lCBTEF4CF8fCxEqLVQqoPSKKazofK6M/edit#gid=0");
  var sheet = ss.getSheets()[0];
  var cellRange = sheet.createTextFinder(candidateRoom).matchEntireCell(true).findNext();
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
 * returns true if the room is in the database already, otherwise false
 */
function removeRoom(room)
{
  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Mh9KF8Sa6Sa_lCBTEF4CF8fCxEqLVQqoPSKKazofK6M/edit#gid=0");
  var sheet = ss.getSheets()[0];
  var cellRange = sheet.createTextFinder(room).matchEntireCell(true).findNext();
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