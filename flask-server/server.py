from flask import Flask, request, send_file
from flask_cors import CORS
from flask_mysqldb import MySQL
from array import *
from helpbot import *
from cosim import *
import string
import random
import os
import base64
import shutil


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
    classList = []
    for x in rows:
        cursor.execute('SELECT * FROM Class WHERE ClassID = %s', (x[1],))
        classRow = cursor.fetchone()
        classList.append(classRow)
    return {"status": "Success", "classList": classList}

@app.route("/createComment", methods=['POST'])
def createComment():
    userID = request.json.get('userID')
    postID = request.json.get('postID')
    comment = request.json.get('comment')
    date = request.json.get('date')
    commentReply = request.json.get('commentReply')
    cursor = mysql.connection.cursor()
    cursor.execute('INSERT INTO PostComment (PostID, UserID, CommentBody, PostTime, ReplyCommentID) VALUES (%s, %s, %s, %s, %s)',
                    (postID, userID, comment, date, commentReply))
    mysql.connection.commit()
    cursor.close()
    return {"status": "Success"}
    
@app.route("/post1", methods=['POST'])
def post1():
    userID = request.json.get('userID')
    postBody = request.json.get('postContent')
    postTitle = request.json.get('postTitle')
    postTag = request.json.get('postTag')
    classID = request.json.get('chosenclass')
    cursor = mysql.connection.cursor()
    cursor.execute(
        'INSERT INTO Posts (UserID, PostStatus, PostBody, PostTitle, PostTag, ClassID) VALUES (%s, 1, %s, %s, %s, %s)',
        (userID, postBody, postTitle, postTag, classID))
    mysql.connection.commit()
    newID = cursor.lastrowid
    link = 'localhost:3000/board/' + str(classID) + '/post/' + str(newID)
    print(link)
    cursor.execute('UPDATE Posts SET PostLink = %s WHERE PostID = %s', (link,newID,))
    mysql.connection.commit()
    cursor.close()
    return {"status": "Success", "message": "message"}

@app.route("/post", methods=['POST'])
def post():
    postTitle = request.json.get('postTitle')
    postBody = request.json.get('postContent')
    pdfName = ""
    classID = request.json.get('chosenclass')
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT PostTitle FROM Posts WHERE classID = "{}"'.format(classID))
    myresult = cursor.fetchall()
    if len(postTitle) > 1:
        for postTitle2 in myresult:
            postTitle2 = postTitle2[0]
            similarity = text_similarity(postTitle, postTitle2)
            if similarity > .5:
                cursor.execute('Select postLink FROM Posts WHERE postTitle = "{}" AND classID = "{}"'.format(postTitle2, classID))
                link = cursor.fetchall()
                print(link)
                link = str(link[-1][0])
                link = "http://" + link
                print("similar post found at: {}".format(link))
                cursor.close()
                return {"status": "Success", "message": "{}".format(link)}
        cursor.execute('Select FileName FROM Resource WHERE classID = "{}"'.format(classID))
        pdfName = cursor.fetchall()
        pdfName = pdfName
        print("classid")
        print(classID)
        print(pdfName)
        response = ask_question(postTitle, postBody, classID, pdfName)
        if response == "error":
            cursor.close()
            return {"status": "Success", "message": "message"}
        else:
            cursor.close()
            return {"status": "Success", "message": "{}".format(response)}
    cursor.close()
    return {"status": "Success", "message": "message"}

@app.route("/getPostTitleBody", methods=['POST'])
def getPostTitleBody():
    postID = request.json.get('postID')
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT PostBody, PostTitle FROM Posts WHERE PostID = %s', (postID,))
    rows = cursor.fetchone()
    cursor.close()
    body = rows[0]
    title = rows[1]
    return {"title" : title, "body": body}


@app.route("/getPosts", methods=['POST'])
def getPosts():
    classID = request.json.get('classID')
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM Posts WHERE ClassID = %s', (classID,))
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
    commentIDs = []
    commentBodies = []
    postTimes = []
    commentReplies = []
    for x in rows:
        userIDs.append(x[1])
        commentIDs.append(x[2])
        commentBodies.append(x[3])
        postTimes.append(x[4])
        commentReplies.append(x[5])

    arr = [userIDs, commentBodies, postTimes, commentIDs, commentReplies]

    return {"status": "Success", "arr": arr, "rows": rows}



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
    classString = ' '.join(random.choices(string.ascii_uppercase, k=20)).replace(" ", "")
    cursor.execute("SELECT * FROM Class WHERE ClassString = %s", (classString,))
    row = cursor.fetchone()
    while row:
        classString = ' '.join(random.choices(string.ascii_uppercase, k=20)).replace(" ", "")
        cursor.execute("SELECT * FROM Class WHERE ClassString = %s", (classString,))
        row = cursor.fetchone()
    cursor.execute("INSERT INTO Class (ClassName, ClassString) VALUES (%s, %s)", (className, classString,))
    mysql.connection.commit()
    classID = cursor.lastrowid
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
    row = cursor.fetchone()
    className = row[1]
    classString = row[2]
    
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
    return {"status":"Success", "students": students, "moderators":moderators,"instructors":instructors, "classname":className, "classstring": classString}

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

@app.route("/addToClass", methods = ['POST'])
def addToClass():
    email = request.json.get('email')
    classID = request.json.get('classID')
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM Users WHERE Email = %s', (email,))
    student = cursor.fetchone()
    print(student)
    if not student:
        return {"status":"Failed", "message":"Student does not exist"}
    if student[5] == 5:
        return {"status":"Failed", "message":"Email is associated with an instructor"}
    cursor.execute('INSERT INTO UserToClass(UserID, ClassID) Values(%s, %s)', (student[0], classID,))
    mysql.connection.commit()
    return {"status": "Success", "student": student}

@app.route('/removeClass', methods = ['POST'])
def removeClass():
    classID = request.json.get('classID')
    cursor = mysql.connection.cursor()
    cursor.execute('SET SQL_SAFE_UPDATES = 0')
    cursor.execute('DELETE FROM UserToClass WHERE ClassID = %s',(classID,))
    cursor.execute('SET SQL_SAFE_UPDATES = 1')
    mysql.connection.commit()
    path = "../flask-server/files/" + str(classID) + "/"
    try:
        shutil.rmtree(path)
    except OSError as e:
        print("Directory does not exist")
    return {"status":"Success"}

@app.route("/removePost", methods = ['POST'])
def removePost():
    postID = request.json.get('postID')
    cursor = mysql.connection.cursor()
    cursor.execute('SET SQL_SAFE_UPDATES = 0')
    cursor.execute('DELETE FROM Posts WHERE PostID = %s', (postID,))
    cursor.execute('SET SQL_SAFE_UPDATES = 1')
    mysql.connection.commit()
    return {"status":"Success"}

@app.route("/removeComment", methods = ['POST'])
def removeComment():
    postID = request.json.get('postID')
    postID = postID.get("postID")
    commentID = request.json.get('commentID')
    print("this is postid " + str(postID))
    print("this is commentid  " + str(commentID))
    cursor = mysql.connection.cursor()
    cursor.execute('SET SQL_SAFE_UPDATES = 0')
    cursor.execute('DELETE FROM PostComment WHERE PostID = "{}" AND CommentID = "{}"'.format(postID, commentID))
    cursor.execute('SET SQL_SAFE_UPDATES = 1')
    mysql.connection.commit()
    return {"status":"Success"}


@app.route("/checkModerator", methods = ['POST'])
def checkModerator():
    classID = request.json.get('classID')
    userID = request.json.get('userID')
    print(classID)
    print(userID)
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM ModeratorToClass WHERE UserID = %s AND ClassID = %s', (userID, classID,))
    row = cursor.fetchone()
    if row:
        return {"status": "Success", "message": "yes"}
    else: 
        return {"status": "Success", "message": "no"}
    
@app.route("/generateNewString", methods = ['POST'])
def generateNewString():
    classID = request.json.get('classID')
    classString = ' '.join(random.choices(string.ascii_uppercase, k=20)).replace(" ", "")
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM Class WHERE ClassString = %s", (classString,))
    row = cursor.fetchone()
    while row:
        classString = ' '.join(random.choices(string.ascii_uppercase, k=20)).replace(" ", "")
        cursor.execute("SELECT * FROM Class WHERE ClassString = %s", (classString,))
        row = cursor.fetchone()
    cursor.execute('UPDATE Class SET ClassString = %s WHERE ClassID = %s', (classString,classID,))
    mysql.connection.commit()
    return {"status":"success", "classstring":classString}

@app.route("/file", methods = ['POST'])
def file():
    fileName = request.form['filename']
    classID = request.form['classid']
    file = request.files['file']
    path = "../flask-server/files/" + classID + "/"
    if not os.path.exists(path):
        os.makedirs(path)
    path = path + fileName
    print(path)
    if os.path.exists(path):
        print(":fail;")
        return {"status":"Failed", "message":"File already exists"}
    file.save(path)
    print(path)
    blob = file.read()
    blob = base64.b64encode(blob)
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO Resource(FileName, ClassID, FilePath, ResourceFile) VALUES(%s, %s, %s, %s)",(fileName, classID, path, blob))
    mysql.connection.commit()
    # path = "../client/public/files/" + classID + "/"
    # # if not os.path.exists(path):
    # #     os.makedirs(path)
    # path1 = path + fileName
    # cursor = mysql.connection.cursor()
    # cursor.execute("SELECT * FROM Resource WHERE FilePath = %s", (path1,))
    # row = cursor.fetchone()
    # if row:
    #     return {"status":"Failed", "message":"File already exists"}
    # cursor.execute("INSERT INTO Resource(FileName, ClassID, FilePath) VALUES(%s, %s, %s)", (fileName, classID, path1,))
    # mysql.connection.commit()
    # if not os.path.exists(path):
    #     os.makedirs(path)    
    # file = request.files['file']
    # file.save(path1)
    return {"status":"Success"}
    
@app.route("/getFiles", methods = ['POST'])    
def getFiles():
    classID = request.json.get('classID')
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT ResourceID, FileName, ClassID, FilePath FROM Resource WHERE ClassID = %s", (classID,))
    rows = cursor.fetchall()
    # for row in rows:
    #     blob = row[4]
    #     blob = base64.b64decode(blob)
    #     fileName.append(row[1])
    #     resource.append(blob)
    return {"status":"Success", "Resource": rows}

@app.route("/getFile", methods = ['POST'])
def getFile():
    filePath = request.json.get("filePath")
    return send_file(filePath)


@app.route("/deleteFile", methods = ['POST'])
def deleteFile():
    fileID = request.json.get('fileID')
    filePath = request.json.get('filePath')
    cursor = mysql.connection.cursor()
    cursor.execute('SET SQL_SAFE_UPDATES = 0')
    cursor.execute('DELETE FROM Resource WHERE ResourceID = %s', (fileID,))
    cursor.execute('SET SQL_SAFE_UPDATES = 1')
    mysql.connection.commit()
    if os.path.exists(filePath):
        os.chmod(filePath, 0o777)
        os.remove(filePath)
    return {"status":"Success"}

@app.route("/addToClass1", methods = ['POST'])
def addToClass1():
    userID = request.json.get('userID')
    classCode = request.json.get('classCode')
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM Class WHERE ClassString = %s', (classCode,))
    row = cursor.fetchone()
    if not row:
        return {"status":"Failed", "message":"Class code does not exist"}
    classID = row[0]
    cursor.execute('SELECT * FROM UserToClass WHERE UserID = %s AND ClassID = %s', (userID, classID,))
    row = cursor.fetchone()
    if row:
        return {"status":"Failed", "message":"Already enrolled in class"}
    cursor.execute('INSERT INTO UserToClass(UserID, ClassID) VALUES (%s, %s)', (userID, classID))
    mysql.connection.commit()
    cursor.execute('SELECT * FROM UserToClass WHERE UserID = %s ', (userID,))
    rows = cursor.fetchall()
    classList = []
    for x in rows:
        cursor.execute('SELECT * FROM Class WHERE ClassID = %s', (x[1],))
        classRow = cursor.fetchone()
        classList.append(classRow)
    return {"status": "Success", "classList": classList}

@app.route("/changePassword", methods = ['POST'])
def changePassword():
    userID = request.json.get('userID')
    password = request.json.get('password')
    cursor = mysql.connection.cursor()
    cursor.execute('UPDATE Users SET Password = %s WHERE UserID = %s', (password, userID,))
    mysql.connection.commit()
    return {"status":"Success"}

@app.route("/getClassName", methods = ["POST"])
def getClassName():
    classID = request.json.get('classID')
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM Class WHERE ClassID = %s", (classID,))
    row = cursor.fetchone()
    if not row:
        return {"status":"Fail"}
    return {"status":"Success", "name":row[1]}

if __name__ == "__main__":
    app.run(debug=True)
