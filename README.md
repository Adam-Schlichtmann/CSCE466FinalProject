# CSCE466FinalProject
Easy-Expense-WebApp
SUBMISSION FILES
 - We have provided all source code to compile and run our application at http://localhost:3000/#/login 
   - Follow the installation guide below for instructions on how to install all necessary components
 - There are three json files. users.json groups.json and transactions.json. These files hold a starter dataset that can be used to test our application.
   - NOTE: You do not need to use this starter data, but if you do not you will need to create multiple accounts and join them to the same group to get the full effect of the application.

INSTALLATION GUIDE

Application Requirements : 
node 10.15.3
mongo 4.0.3

Node - Installation
1. Download the latest stable release of NodeJS from https://nodejs.org and install using all the default options.
2. run " sudo npm install " to install packages required by the webapp
3. install nodemon  "npm install -g nodemon" globally
4. run the webapp by entering the root directory of this web app and typing "nodemon"
 •You would need Mongo installed to run the web app as intended

Mongo - Installation
1. Download mongoDB server at https://www.mongodb.com/
   - Once you install Mongo, there a few simple steps you need to follow to run it. 
   - You need to create a directory where Mongo will store database files. 
   - This directory should have write permissions for the current user. 
   - Then, you need to run MongoD(Mongo Daemon), which is a background process that handles data requests.
   - By default, MongoD expects the data directory to be/data/dbin the root of your drive. 
   - You have to create this directory
   Creating \data\db: Mac System
   - Open the Terminal and type following:
   - $ sudo mkdir -p /data/db  
   - $ whoami user (i.e whoami adam)
   - $ sudo chown user /data/db 
   - $ mongod
2. For creating a Mongo connection, Open terminal and type mongo (mongod must be running in a different terminal instance)
   - To quit, type quit()
   - Mongo - Commands for Accessing DBs and Collections
    - show dbs
    - use "DBname"
    - show collections
3. To import json files
   - Open a new terminal and run the following command
   - mongoimport --db expense --collection transactions --file path_to_/transactions.json --jsonArray
    - Use the same command, for groups.json and users.json accordingly
