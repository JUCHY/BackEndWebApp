open command prompt and cd in folder, then type npm install if node_modules have not been installed
Run by typing node app.js while in folder
access routes by http://localhost:3000/
access post requests with curl on a different command prompt
i.e.
curl --data "username=JohnDoe&password=Foobar&classification=Film&genre=Theatre"  http://localhost:3000/register 
in command prompt
then
http://localhost:3000/login?username=JohnDoe&password=Foobar
in browser
http://localhost:3000/getPreference
in browser
http://localhost:3000/getEvents

for set preferences, uncomment app.get('/setPreferences') in code, and comment app.post('/setPreferences')
then in browser
http://localhost:3000/setPreferences?classification=Theatre&genre=Film this should lead invalid genre or classifcation
http://localhost:3000/setPreferences?classification=Film&genre=Theatre this should work fine

As for how easily test post without some frontend html, I'm not familiar with that
Genres and classifications are limited to the list of genres and classifications given in the coding challenge

data is saved to db.json