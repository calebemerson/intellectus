function doGet(e) {
  var page = e.parameters["page"];
  if(typeof page == "undefined")
  {
    return HtmlService.createHtmlOutputFromFile("HomePage");
  }
  requestStatistics("B");
  return HtmlService.createHtmlOutputFromFile(page);
}

function addStudent(room)
{
  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Mh9KF8Sa6Sa_lCBTEF4CF8fCxEqLVQqoPSKKazofK6M/edit#gid=0");
  var sheet = ss.getSheets()[0];
  var rowIndex = sheet.createTextFinder(room).findNext().getRow();
  var understand = sheet.getRange(rowIndex,"2");
  var total = sheet.getRange(rowIndex,"3");
  understand.setValue(understand.getValue()+1);
  total.setValue(total.getValue()+1);

}

function requestStatistics(room)
{
  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Mh9KF8Sa6Sa_lCBTEF4CF8fCxEqLVQqoPSKKazofK6M/edit#gid=0");
  var sheet = ss.getSheets()[0];
  var rowIndex = sheet.createTextFinder(room).findNext().getRow();
  var understand = sheet.getRange(rowIndex,"2");
  var total = sheet.getRange(rowIndex,"3");
  return (understand/total)
}