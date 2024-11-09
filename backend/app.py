from datetime import datetime
from flask import Flask, request, jsonify, session
from models import db, Customer, Package, Order, OrderDetails, DeliveryTypeEnum
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


@app.route("/createOrder", methods=["POST"])
def createOrder():
    # Check customer
    try:
        packages_data = request.json["packages"]

        if not isinstance(packages_data, list) or len(packages_data) == 0:
            return jsonify({"error": "Invalid input. 'packages' should be a non-empty list."}), 400

        source_address = request.json.get("sourceAddress")
        departure_address = request.json.get("departureAddress")
        delivery_type = request.json.get("deliveryType")

        if not source_address or not departure_address or not delivery_type:
            return jsonify({"error": "Missing required fields: 'sourceAddress', 'departureAddress', 'deliveryType'."}), 400

        # Normalize deliveryType input to ensure it's correct
        delivery_type = delivery_type.lower().capitalize()

        # Validate deliveryType against enum values
        if delivery_type not in [e.value for e in DeliveryTypeEnum.__members__.values()]:
            return jsonify({"error": f"Invalid deliveryType. It must be one of: {', '.join([e.value for e in DeliveryTypeEnum])}."}), 400

        total_price = 0
        package_objects = []

        for package_data in packages_data:
            weight = package_data["weight"]
            length = package_data["length"]
            width = package_data["width"]
            height = package_data["height"]

            package_price = (length * width * height) * 0.05
            total_price += package_price

            new_package = Package(weight=weight, length=length, width=width, height=height)
            package_objects.append(new_package)

        total_price = round(total_price, 2)

        new_order = Order(price=total_price, packages=package_objects)
        db.session.add(new_order)
        db.session.commit()

        new_order_details = OrderDetails(
            trackingNumber=new_order.trackingNumber,
            sourceAddress=source_address,
            departureAddress=departure_address,
            deliveryType=delivery_type
        )

        db.session.add(new_order_details)
        db.session.commit()

        response = {
            "trackingNumber": new_order.trackingNumber,
            "totalPrice": new_order.price,
            "packages": [
                {
                    "id": package.id,
                    "weight": package.weight,
                    "length": package.length,
                    "width": package.width,
                    "height": package.height
                }
                for package in package_objects
            ],
            "orderDetails": {
                "sourceAddress": new_order_details.sourceAddress,
                "departureAddress": new_order_details.departureAddress,
                "deliveryType": new_order_details.deliveryType
            }
        }

        return jsonify(response), 201

    except KeyError as e:
        app.logger.error(f"Missing key error: {str(e)}")
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error creating order: {str(e)}")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)

