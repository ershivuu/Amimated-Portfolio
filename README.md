This is the complete code with front-end and backend
Please switch between the branches to get the backend
Backend branch also contains a dump file
Also please change the user name and password in the portfolio js file in backend branch
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // your user name  
  password: "root", // your password
  database: "portfolio", 
});

change the api URL in admin.js and globalscript.js in frontend code
//current url
const apiUrl = "http://192.168.29.198:5000";   

you can run the backend using 
nodemon portfolio-backend\portfolio.js

if You have any issue u can contact me on er.shivamsg@gmail.com
