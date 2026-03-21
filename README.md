ECS522U Coursework for GUIs Module, Weather app for outdoor enthusiasts

When commiting and pushing push entire weather-app folder and not individual files to maintain heirachy
even if you have only edited a single file

before being able to run code, run "npm install" in terminal in the correct directory so that node_modules will be added correctly
node_modules is an extremely large file so we can't commit to the repository

Also run "npm install react-router-dom" so you can use the navbar part. 

When coding your page, make a new file called "*pagename*.js" and code the page into there, then to add it to the navbar, go into navbar.js and with the previous links add your page link
syntax as follows: 
<code>
<li><Link to="/*pagename*" style={linkStyle}>*pagename*</Link></li>
</code>

then in app.js add to the previous routes
syntax as follows:
<Route path="/*pagename*" element={<*pagename* />} />

and import your page in app.js
syntax as follows:
import *pagename* from './*pagename*';

"npm start" in terminal to run react app, app will update when changes are made on browser page so no need to npm start constantly
make sure you are in the weather-app folder in the command line, or just run it in vs-code to make life easier

