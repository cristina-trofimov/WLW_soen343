from flask import Blueprint
from endpoints.auth import get_current_user
from models import Customer
from flask import jsonify

customer = Blueprint('customer', __name__)

@customer.route('/get_customer', methods=['GET'])
def get_customer():
    
    customer_id = get_current_user()
    customer = Customer.query.filter_by(id=customer_id).first()
    
    if not customer:
        return jsonify({"error" : "Customer not found"}), 404
    
    return jsonify({
        "id" : customer.id,
        "email" : customer.email,
        "ecoPoints" : customer.ecoPoints}), 200
    