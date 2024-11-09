# payment.py

from flask import Blueprint, request, jsonify, session
from models import db, Customer
from flask_bcrypt import Bcrypt
import json
from endpoints.auth import get_current_user

payment_blueprint = Blueprint('payment_blueprint', __name__)

CURRENT_USER_FILE = 'current_user.json'

@payment_blueprint.route("/payment", methods=["POST"])
def payment():
    
    print("Hitting the payment wall")
    number = request.json["number"]
    name = request.json["name"]
    expiration_date = request.json["expriation_date"]
    cvv = request.json["cvv"]

    if not number or not name or not expiration_date or not cvv:
        return jsonify({"error" : "Invalid payment information"}), 400
    elif len(number) != 16:
        return jsonify({"error" : "Invalid card number"}), 400
    elif len(name) < 2:
        return jsonify({"error" : "Invalid name"}), 400
    elif len(expiration_date) != 5:
        return jsonify({"error" : "Invalid expiration date"}), 400
    
    user_id = get_current_user()

    if not user_id:
        return jsonify({"error" : "Unauthorized"}), 401 
    
    user = Customer.query.filter_by(id=user_id).first()

    print("Payment accepeted")

    # add the order to the customer's order history)
    
    print("Command confirmed, added to the cusomer's order history")
        
    return jsonify({
        "id" : user.id,
        "email" : user.email,
        "card number": number}), 200