from flask import Flask, request
from flask_cors import CORS
from flask_mysqldb import MySQL
from array import *
from helpbot import *
from cosim import *

app = Flask(__name__)
mysql = MySQL(app)
CORS(app)

app.config['MYSQL_HOST'] = "assignment1db.cghulbrks8jh.us-east-2.rds.amazonaws.com"
app.config['MYSQL_USER'] = 'admin'
app.config['MYSQL_PASSWORD'] = 'svdden+=479'
app.config['MYSQL_DB'] = 'DiscussionBoard'


# Members API Route
@app.route("/members")
def members():
    return {"members": ["Member1", "Member2", "Member3"]}


@app.route("/login", methods=["POST"])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM Users WHERE Email = %s AND Password = %s ', (email, password))
    rows = cursor.fetchone()
    print(rows)
    cursor.close()
    if rows:
        return {"token" : rows[0], "password" : rows[1], "email" : rows[2], "name" : rows[3], "lastname" : rows[4], "accesslevel" : rows[5]}
    return {"token" : ""}

@app.route("/getClasses", methods=['POST'])
def getClasses():
    userID = request.json.get('userID')
    print(userID)
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM UserToClass WHERE UserID = %s ', (userID,))
    rows = cursor.fetchall()
    print(rows)
    classDict = dict()
    for x in rows:
        cursor.execute('SELECT * FROM Class WHERE ClassID = %s', (x[1],))
        classRow = cursor.fetchone()
        classDict[classRow[0]] = classRow[1]
    print(classDict)
    return classDict


@app.route("/post", methods=['POST'])
def post():
    userID = request.json.get('userID')
    print(userID[0])
    postBody = request.json.get('postContent')
    postTitle = request.json.get('postTitle')
    postTag = request.json.get('postTag')
    classID = request.json.get('chosenclass')
    cursor = mysql.connection.cursor()
    cursor2 = mysql.connection.cursor()

    cursor.execute(
        'INSERT INTO Posts (UserID, PostStatus, PostBody, PostTitle, PostTag, ClassID) VALUES (%s, 1, %s, %s, %s, %s)',
        (userID, postBody, postTitle, postTag, classID))
    mysql.connection.commit()
    cursor.execute('SELECT PostTitle FROM Posts')
    myresult = cursor.fetchall()
    vartemp = 0
    if len(postTitle) > 1:
        for postTitle2 in myresult:
            postTitle2 = postTitle2[0]
            similarity = text_similarity(postTitle, postTitle2)
            if similarity > .5:
                cursor.execute('Select postBody FROM Posts WHERE postTitle = "{}"'.format(postTitle2))
                body = cursor.fetchall()
                print(body[-1][0])
                #insert
                print("similar post found at: {}".format(postTitle2))
                vartemp = 1
                break
        if vartemp == 0:
            response = ask_question(postTitle)
            print(response)
            # insert
    cursor.close()
    return {"status": "Success", "message": "message"}


@app.route("/getPosts", methods=['POST'])
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
    cursor.close()
    return arr

@app.route("/getPostComments", methods = ['POST'])
def getPostComments():
    postID = request.json.get('postID')
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM PostComment WHERE PostID = %s', (postID,))
    rows = cursor.fetchall()
    userIDs = []
    commentBodies = []
    postTimes = []
    for x in rows:
        userIDs.append(x[1])
        commentBodies.append(x[3])
        postTimes.append(x[4])
    arr = [userIDs, commentBodies, postTimes]

    return arr



@app.route("/createUser", methods = ['POST'])
def createUser():
    firstName = request.json.get('firstName')
    lastName = request.json.get('lastName')
    email = request.json.get('email')
    password = request.json.get('password')
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM Users WHERE Email = %s', (email,))
    rows = cursor.fetchall()
    if rows:
        return {"status": "Failed"}
    cursor.execute("INSERT INTO Users (Password, Email, FirstName, LastName, AccessLevel) VALUES (%s, %s, %s, %s, 0)", (password, email, firstName, lastName))

    mysql.connection.commit()
    cursor.execute('SELECT * FROM Users WHERE Email = %s AND Password = %s ', (email, password))
    rows = cursor.fetchone()
    print(rows)
    cursor.close()
    if rows:
        return {"token" : rows[0], "password" : rows[1], "email" : rows[2], "name" : rows[3], "lastname" : rows[4], "accesslevel" : rows[5]}
    return {"token" : ""}

@app.route("/getCommentUser", methods = ['POST'])
def getCommentUser():
    userID = request.json.get('userID')
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT FirstName, LastName FROM Users WHERE UserID = %s', (userID,))
    rows = cursor.fetchone()
    cursor.close()
    first = rows[0]
    last = rows[1]
    fullname = str(first + " " + last)
    return {"name" : fullname}

if __name__ == "__main__":
    app.run(debug=True)