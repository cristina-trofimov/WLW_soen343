# order.py

from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from models import db, Customer, Package, Order, OrderDetails, DeliveryTypeEnum
import json
from endpoints.auth import get_current_user

order = Blueprint('order', __name__)

CURRENT_USER_FILE = 'current_user.json'

@order.route("/create_order", methods=["POST"])
def create_order():
    try:
        # Extract input data from the request JSON
        form_data = request.get_json()
        
        sender_name = form_data.get("senderName")
        sender_address = form_data.get("senderAddress")
        recipient_name = form_data.get("recipientName")
        recipient_address = form_data.get("recipientAddress")
        recipient_phone = form_data.get("recipientPhone")
        package_weight = form_data.get("packageWeight")
        package_height = form_data.get("packageHeight")
        package_width = form_data.get("packageWidth")
        package_length = form_data.get("packageLength")
        chosen_delivery_date = form_data.get("chosenDeliveryDate")
        chosen_shipping_price = form_data.get("chosenShippingPrice")
        delivery_method = form_data.get("deliveryMethod")
        special_instructions = form_data.get("specialInstructions")
        distance = form_data.get("distance")

        # Validate required fields
        if not all([sender_name, sender_address, recipient_name, recipient_address, recipient_phone, 
                    package_weight, package_height, package_width, package_length, chosen_shipping_price, delivery_method]):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Normalize and validate deliveryMethod
        delivery_method = delivery_method.strip().lower()
        if delivery_method not in [e.value for e in DeliveryTypeEnum.__members__.values()]:
            return jsonify({"error": f"Invalid delivery method. Must be one of: {', '.join([e.value for e in DeliveryTypeEnum])}"}), 400

        # Get current user ID (assumes function get_current_user() is defined in the same module)
        customer_id = get_current_user()
        if not customer_id:
            return jsonify({"error": "Unauthorized. Please log in."}), 401

        # Create Package instance
        new_package = Package(
            weight=package_weight,
            length=package_length,
            width=package_width,
            height=package_height
        )
        db.session.add(new_package)
        db.session.commit()  # Commit to assign an ID to the package

        # Create Order instance
        new_order = Order(
            price=chosen_shipping_price,
            packageId=new_package.id,
            customerId=customer_id
        )
        db.session.add(new_order)
        db.session.commit()  # Commit to assign tracking number

        # Create OrderDetails instance
        new_order_details = OrderDetails(
            orderId=new_order.trackingNumber,
            senderName=sender_name,
            senderAddress=sender_address,
            recipientName=recipient_name,
            recipientAddress=recipient_address,
            recipientPhone=recipient_phone,
            # Convert chosen_delivery_date to a datetime object
            chosenDeliveryDate=chosen_delivery_date,
            deliveryMethod=delivery_method,
            specialInstructions=special_instructions,
            distance=distance
        )

        db.session.add(new_order_details)
        db.session.commit()

        # Prepare response
        response = {
            "trackingNumber": new_order.trackingNumber,
            "totalPrice": new_order.price,
            "package": {
                "id": new_package.id,
                "weight": new_package.weight,
                "length": new_package.length,
                "width": new_package.width,
                "height": new_package.height
            },
            "orderDetails": {
                "senderName": new_order_details.senderName,
                "recipientName": new_order_details.recipientName,
                "deliveryMethod": new_order_details.deliveryMethod,
                "chosenDeliveryDate": new_order_details.chosenDeliveryDate,
                "specialInstructions": new_order_details.specialInstructions,
                "distance": new_order_details.distance
            }
        }

        return jsonify(response), 201

    except KeyError as e:
        # Use current_app.logger to log errors
        current_app.logger.error(f"Missing key error: {str(e)}")
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        # Use current_app.logger to log errors
        current_app.logger.error(f"Error creating order: {str(e)}")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


@order.route('/get_all_orders', methods=['GET'])
def get_all_orders():
    try:
        # Query all orders, along with related OrderDetails and Package
        orders = Order.query.all()

        # Serialize the data to JSON format
        orders_list = []
        for order in orders:
            # Get the related package
            package = Package.query.get(order.packageId)
            
            # Get the related order details (could be multiple)
            order_details = OrderDetails.query.filter_by(orderId=order.trackingNumber).all()
            
            # Append the order data, along with package and order details
            orders_list.append({
                'trackingNumber': order.trackingNumber,
                'price': order.price,
                'package': {
                    'id': package.id,
                    'weight': package.weight,
                    'length': package.length,
                    'width': package.width,
                    'height': package.height,
                } if package else None,
                'orderDetails': [{
                    'id': detail.id,
                    'senderName': detail.senderName,
                    'senderAddress': detail.senderAddress,
                    'recipientName': detail.recipientName,
                    'recipientAddress': detail.recipientAddress,
                    'recipientPhone': detail.recipientPhone,
                    'chosenDeliveryDate': detail.chosenDeliveryDate,
                    'deliveryMethod': detail.deliveryMethod,
                    'specialInstructions': detail.specialInstructions,
                    'distance': detail.distance,
                } for detail in order_details],
                'customerId': order.customerId
            })
        
        return jsonify(orders_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500