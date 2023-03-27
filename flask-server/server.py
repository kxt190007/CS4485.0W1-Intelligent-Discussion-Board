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
        return {"token" : rows[0], "password" : rows[1], "email" : rows[2], "name" : rows[3], "lastname" : rows[4], "accesslevel" : rows[5]}
    return {"token" : ""}

@app.route("/getClasses", methods = ['POST'])
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
    cursor.close()
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

@app.route("/createClass", methods = ['POST'])
def createClass():
    className = request.json.get('className')
    classSection = request.json.get('classSection')
    className = className + '.' + classSection
    firstName = request.json.get('firstName')
    email = request.json.get('email')
    lastName = request.json.get('lastName')
    profList = request.json.get('profList')
    if profList:
        className = className + " - Multiple Instructors"
    else:
        className = className + " - " + firstName + " " + lastName
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM Class WHERE ClassName = %s", (className,))
    row = cursor.fetchone()
    if row:
        return {"status": "Failed", "message" : "Class already exists"}
    cursor.execute("INSERT INTO Class (ClassName) VALUES (%s)", (className,))
    mysql.connection.commit()
    cursor.execute("SELECT * FROM Class WHERE ClassName = %s", (className,))
    row = cursor.fetchone()
    classID = row[0]
    profList.append(email)
    for i in range(len(profList)):
        cursor.execute("SELECT * FROM Users WHERE Email = %s", (profList[i],))
        row = cursor.fetchone()
        userID = row[0]
        cursor.execute("INSERT INTO UserToClass (UserID, ClassID) VALUES (%s, %s)", (userID, classID,))
    mysql.connection.commit()
    return {"status":"Success", "className" : className, "classID" : classID}

@app.route("/getUser", methods = ['POST'])
def getUser():
    email = request.json
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM Users WHERE Email = %s', (email,))
    rows = cursor.fetchall()
    print(rows)
    if not rows:
        return {"status": "Failed", "message": "Email does not exist"}
    if rows[0][5] != 5:
        return {"status": "Failed", "message": "User is not an instructor"}
    return {"status":"Success"}
    
@app.route("/getStudents", methods = ['POST'])
def getStudents():
    classID = request.json.get('classID')
    print(classID)
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM Class WHERE ClassID = %s', (classID,))
    className = cursor.fetchone()[1]
    cursor.execute('SELECT UserID FROM UserToClass WHERE ClassID = %s', (classID,))
    rows = cursor.fetchall()
    print(rows)
    moderators = []
    students = []
    instructors = []
    for x in rows:
        cursor.execute('SELECT * FROM Users WHERE UserID = %s', (x[0],))
        student = cursor.fetchone()
        cursor.execute('SELECT * FROM ModeratorToClass WHERE UserID = %s', (x[0],))
        moderator = cursor.fetchall()
        isModerator = False
        if moderator:
            for y in moderator:
                if y[1] == classID:
                    moderators.append(student)
                    isModerator = True
                    break
        if student[5] == 0 and not isModerator:
            students.append(student)
        elif student[5] == 5:
            instructors.append(student)
    return {"status":"Success", "students": students, "moderators":moderators,"instructors":instructors, "classname":className}

@app.route("/demote", methods = ['POST'])
def demote():
    userID = request.json.get('studentID')
    classID = request.json.get('classID')
    cursor = mysql.connection.cursor()
    cursor.execute('SET SQL_SAFE_UPDATES = 0')
    cursor.execute('DELETE FROM ModeratorToClass WHERE UserID = %s AND ClassID = %s', (userID,classID,))
    cursor.execute('SET SQL_SAFE_UPDATES = 1')
    mysql.connection.commit()
    return {"status":"Success"}


@app.route("/promote", methods = ['POST'])
def promote():
    userID = request.json.get('studentID')
    classID = request.json.get('classID')
    cursor = mysql.connection.cursor()
    cursor.execute('INSERT INTO ModeratorToClass(UserID, ClassID) VALUES(%s, %s)', (userID, classID,))
    mysql.connection.commit()
    return {"status":"Success"}


@app.route("/removeStudent", methods = ['POST'])
def removeStudent():
    userID = request.json.get('studentID')
    classID = request.json.get('classID')
    cursor = mysql.connection.cursor()
    cursor.execute('SET SQL_SAFE_UPDATES = 0')
    cursor.execute('DELETE FROM ModeratorToClass WHERE UserID = %s AND ClassID = %s', (userID, classID,))
    cursor.execute('DELETE FROM UserToClass WHERE UserID = %s AND ClassID = %s', (userID, classID,))
    cursor.execute('SET SQL_SAFE_UPDATES = 1')
    mysql.connection.commit()
    return {"status": "Success"}


if __name__ == "__main__":
    app.run(debug=True)
