function doGet(e) {
  var page = e.parameters["page"];
  if(page == "StudentPage")
  {
    return HtmlService.createHtmlOutputFromFile("StudentPage")
  }
  else if(page == "HomePage")
  {
    return HtmlService.createHtmlOutputFromFile("HomePage")
  }
  return HtmlService.createHtmlOutputFromFile("StudentPage");
}

function addStudent(student)
{
  
}