function doGet(e) {
  if(e.parameter["page"] == "Test1")
  {
    return HtmlService.createHtmlOutputFromFile("Test1")
  }
  else if (e.parameter["page"] == "Test2")
  {
    return HtmlService.createHtmlOutputFromFile("Test2")
  }
  return ContentService.createTextOutput("Hello World");
}
