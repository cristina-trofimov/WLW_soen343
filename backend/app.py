from flask import Flask, request, jsonify, session
from models import db, Customer
from config import ApplicationConfig
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
cors = CORS(app, supports_credentials=True)
server_session = Session(app)

db.init_app(app)

with app.app_context():
    db.create_all()
    
    
@app.route("/@me", methods=["GET"])
def get_current_customer():
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
    
    customer_exists = Customer.query.filter_by(email=email).first() is not None
    
    if customer_exists:
        return jsonify({"error" : "Customer already exists"}), 409
        
    hashed_password = bcrypt.generate_password_hash(password)    
    
    new_user = Customer(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    session["user_id"] = new_user.id
    
    return jsonify({
        "id" : new_user.id,
        "email" : new_user.email}), 201
    
    
@app.route("/login", methods=["POST"])  
def login_customer():
    email = request.json["email"]
    password = request.json["password"]
    
    customer = Customer.query.filter_by(email=email).first()
    
    if customer is None:
        return jsonify({"error" : "Invalid email"}), 401
    
    if not bcrypt.check_password_hash(customer.password, password):
        return jsonify({"error" : "Invalid password"}), 401
    
    session["user_id"] = customer.id
    
    return jsonify({
        "id" : customer.id,
        "email" : customer.email}), 200  

if __name__ == "__main__":
    app.run(debug=True)

