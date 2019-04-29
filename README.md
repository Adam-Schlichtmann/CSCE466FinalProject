# CSCE466FinalProject
Easy-Expense-WebApp

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
    - Creating \data\db: Mac System
    - Open the Terminal and type following:
    - $ sudo mkdir -p /data/db  
    - $ whoami <user> (i.e whoami adam)
    - $ sudo chown <user> /data/db 
    - $ mongod
2. For creating a Mongo connection, Open terminal and type mongo
    - To quit, type quit()
    - mongoimport --db expense --collection transactions --file path_to_/transactions.json --jsonArray

Mongo - Commands for Accessing DBs and Collections
  •show dbs
  •show collections
