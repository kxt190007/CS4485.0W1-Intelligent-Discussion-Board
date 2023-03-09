from flask import Flask, request
from flask_cors import CORS
from flask_mysqldb import MySQL
from array import *

app = Flask(__name__)
mysql = MySQL(app)
CORS(app)

app.config['MYSQL_HOST'] = "assignment1db.cghulbrks8jh.us-east-2.rds.amazonaws.com"
app.config['MYSQL_USER'] = 'admin'
app.config['MYSQL_PASSWORD'] = 'svdden+=479'
app.config['MYSQL_DB'] = 'DiscussionBoard'





#Members API Route
@app.route("/members")
def members():
    return {"members": ["Member1", "Member2", "Member3"]}

@app.route("/login", methods = ["POST"])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM Users WHERE Email = %s AND Password = %s ', (email, password))
    rows = cursor.fetchone()
    print(rows)
    cursor.close()
    if rows:
        return {"token" : rows[0], "password" : rows[1], "email" : rows[2], "name" : rows[3], "lastname" : rows[4]}
    return {"token" : ""}

@app.route("/getClasses", methods = ['POST'])
def getClasses():
    userID = request.json.get('userID')
    print(userID)
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM UserToClass WHERE UserID = %s ', (userID))
    rows = cursor.fetchall()
    print(rows)
    classDict = dict()
    for x in rows:
        cursor.execute('SELECT * FROM Class WHERE ClassID = %s', (x[1]))
        classRow = cursor.fetchone()
        classDict[classRow[0]] = classRow[1]
    print(classDict)
    return classDict

@app.route("/post", methods = ['POST'])
def post():
    userID = request.json.get('userID')
    print(userID[0])
    postBody = request.json.get('postContent')
    postTitle = request.json.get('postTitle')
    postTag = request.json.get('postTag')
    classID = request.json.get('chosenclass')
    cursor = mysql.connection.cursor()
    cursor.execute('INSERT INTO Posts (UserID, PostStatus, PostBody, PostTitle, PostTag, ClassID) VALUES (%s, 1, %s, %s, %s, %s)', (userID, postBody, postTitle, postTag, classID))
    mysql.connection.commit()
    cursor.close()
    return  {"status": "Success", "message": "message"}
    
@app.route("/getPosts", methods = ['POST'])
def getPosts():
    classID = request.json.get('classID')
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM Posts WHERE ClassID = %s', classID)
    rows = cursor.fetchall()
    print(rows)
    postIDs = []
    UserIDs = []
    postStatus = []
    postBodies = []
    postTitles = []
    postTags = []
    for x in rows:
        postIDs.append(x[0])
        UserIDs.append(x[1])
        postStatus.append(x[2])
        postBodies.append(x[3])
        postTitles.append(x[4])
        postTags.append(x[5])
    arr = [postIDs,UserIDs,postStatus,postBodies,postTitles,postTags]
        
    return arr

if __name__ == "__main__":
    app.run(debug=True)