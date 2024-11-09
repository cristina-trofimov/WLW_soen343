# auth.py

from flask import Blueprint, request, jsonify, session
from models import db, Customer
from flask_bcrypt import Bcrypt
import json

auth = Blueprint('auth', __name__)
bcrypt = Bcrypt()

@auth.route("/register", methods=["POST"])
def register():
    email = request.json["registerEmail"]
    password = request.json["registerPassword"]
    
    customer_exists = Customer.query.filter_by(email=email).first() is not None
    
    if customer_exists:
        return jsonify({"error" : "Customer already exists"}), 409
        
    hashed_password = bcrypt.generate_password_hash(password)    
    
    new_user = Customer(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({
        "id" : new_user.id,
        "email" : new_user.email}), 201

@auth.route("/login", methods=["POST"])  
def login_customer():
    email = request.json["loginEmail"]
    password = request.json["loginPassword"]
    
    customer = Customer.query.filter_by(email=email).first()
    
    if customer is None:
        return jsonify({"error" : "Invalid email"}), 401
    
    if not bcrypt.check_password_hash(customer.password, password):
        return jsonify({"error" : "Invalid password"}), 401
    
    # session["user_id"] = customer.id
    
    save_current_user(customer.id)
    
    return jsonify({
        "id" : customer.id,
        "email" : customer.email}), 200
    
@auth.route("/current_user", methods=["GET"])
def get_current_customer():
    
    print("Hitting the /current_user route")
    user_id = get_current_user()
    print(f"USER ID: {user_id}")
    
    if not user_id:
        return jsonify({"error" : "Unauthorized"}), 401 
    
    user = Customer.query.filter_by(id=user_id).first()
    
    return jsonify({
        "id" : user.id,
        "email" : user.email}), 200
    
@auth.route('/logout', methods=['POST']) 
def logout():
    clear_current_user()
    return jsonify({'message': 'Logged out'})

 
CURRENT_USER_FILE = 'current_user.json'

def save_current_user(id):
    with open(CURRENT_USER_FILE, 'w') as f:
        json.dump({'id': id}, f)

def get_current_user():
    try:
        with open(CURRENT_USER_FILE, 'r') as f:
            data = json.load(f)
            return data['id']
    except FileNotFoundError:
        return None

def clear_current_user():
    save_current_user(None)