from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session
from config import ApplicationConfig
from models import db, Customer

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
server_session = Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()
    
@app.route("/@me", methods=["GET"])
def get_current_customer():
    customer_id = session.get("customer_id")
    
    if not customer_id:
        return jsonify({"error" : "Unauthorized"}), 401 
    
    customer = Customer.query.filter_by(id=customer_id).first()
    return jsonify({
        "id" : customer.id,
        "email" : customer.email}), 200
      
    
@app.route("/register", methods=["POST"])
def register_customer():
    email = request.json["email"]
    password = request.json["password"]
    
    customer_exists = Customer.query.filter_by(email=email).first() is not None
    
    if customer_exists:
        return jsonify({"error" : "Customer already exists"}), 409
        
    hashed_password = bcrypt.generate_password_hash(password)    
    new_customer = Customer(email=email, password=hashed_password)
    db.session.add(new_customer)
    db.session.commit()
    
    session["customer_id"] = new_customer.id
    
    return jsonify({
        "id" : new_customer.id,
        "email" : new_customer.email}), 201
    
    
@app.route("/login", methods=["POST"])  
def login_customer():
    email = request.json["email"]
    password = request.json["password"]
    
    customer = Customer.query.filter_by(email=email).first()
    
    if customer is None:
        return jsonify({"error" : "Invalid email"}), 401
    
    if not bcrypt.check_password_hash(customer.password, password):
        return jsonify({"error" : "Invalid password"}), 401
    
    session["customer_id"] = customer.id
    
    return jsonify({
        "id" : customer.id,
        "email" : customer.email}), 200 
    
    
@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("customer_id")
    return "200" 

if __name__ == "__main__":
    app.run(debug=True)

