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
    print(email)
    password = request.json.get('password')
    cursor = mysql.connection.cursor()
    cursor.execute('SELECT * FROM Users WHERE Email = %s AND Password = %s ', (email, password))
    rows = cursor.fetchone()
    if rows:
        return  {"status": "Success", "message": "message"}
    return {"status": "Failed", "meesage": "message"}
    
@app.route("/post", methods = ['POST'])
def post():
    cursor = mysql.connection.cursor()
    cursor.execute('INSERT INTO Posts (UserID, PostStatus, PostBody, PostTitle, PostTag) VALUES (1, 1, "hello", "test", "test")')
    mysql.connection.commit()
    return  {"status": "Success", "message": "message"}
    

if __name__ == "__main__":
    app.run(debug=True)