from flask import Flask, jsonify, request, session
from models import db, Customer
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from datetime import timedelta

app = Flask(__name__)

app.config["SECRET_KEY"] = "tamprongs"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///./db.sqlite"
# app.config['SESSION_COOKIE_DOMAIN'] = '127.0.0.1'
app.config.update(
    SESSION_COOKIE_SECURE=False,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
)


SQLALCHEMY_TRACK_MODIFICATIONS = False 
SQLALCHEMY_ECHO = True

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True, allow_headers=["Content-Type", "Authorization","Access-Control-Allow-Credentials"], expose_headers=["Content-Type", "Authorization"])
# CORS(app, support_credentials=True)
db.init_app(app)

print(app.config)

with app.app_context():
    db.create_all()

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route("/me", methods=["GET"])
def get_current_customer():
    
    print("inside the me method")
    print("Session contents:", session)
    print("All cookies:", request.cookies)
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error" : "Unauthorized"}), 401 
    
    user = Customer.query.filter_by(id=user_id).first()
    
    
    
    return jsonify({
        "id" : user.id,
        "email" : user.email}), 200

@app.route("/register", methods=["POST"])
def register():
    
    email = request.json["email"]
    password = request.json["password"]
    
    user_exists = Customer.query.filter_by(email=email).first() is not None
    
    if user_exists:
        return jsonify({
            "error": "User already exists"
            }), 400
    
    hashed_password = bcrypt.generate_password_hash(password)
    new_user = Customer(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    session["user_id"] = new_user.id
    
    return jsonify({
        "id": new_user.id,
        "email": new_user.email,
        })
    
    
@app.route("/login", methods=["POST"])
def login():
    
    email = request.json["email"]
    password = request.json["password"]
    
    user = Customer.query.filter_by(email=email).first()
    
    if user is None: 
        return jsonify({
            "error": "Unauthorised : Incorrect email"
            }), 401
    
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({
            "error": "Unauthorised : Incorrect password"
            }), 401
        
    session["user_id"] = user.id
    session["test"] = "123"
    
    print(session)

    
    return jsonify({
        "id": user.id,
        "email": user.email,
        })
    
    
if __name__ == "__main__":
    app.run(debug=True)