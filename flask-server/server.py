from flask import Flask, request
from flask_cors import CORS
from flask_mysqldb import MySQL

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
    cursor.close()
    if rows:
        return {"token" : rows[0]}
    return {"token" : ""}

    
@app.route("/post", methods = ['POST'])
def post():
    userID = request.json.get('userID')
    print(userID[0])
    postBody = request.json.get('postContent')
    postTitle = request.json.get('postTitle')
    postTag = request.json.get('postTag')
    cursor = mysql.connection.cursor()
    cursor.execute('INSERT INTO Posts (UserID, PostStatus, PostBody, PostTitle, PostTag) VALUES (%s, 1, %s, %s, %s)', (userID, postBody, postTitle, postTag))
    mysql.connection.commit()
    cursor.close()
    return  {"status": "Success", "message": "message"}
    


if __name__ == "__main__":
    app.run(debug=True)