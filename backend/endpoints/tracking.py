from flask import Blueprint
from flask import Flask, jsonify, request
from models import db, TrackingDetails
from sqlalchemy.orm import joinedload


tracking = Blueprint('tracking', __name__)


@tracking.route("/tracking_details", methods=["GET"])
def get_tracking_details():
    tracking_number = request.args.get('trackingNumber')

    if tracking_number:
        # Fetch tracking details for a specific tracking number
        tracking_detail = TrackingDetails.query.get(tracking_number)
        if not tracking_detail:
            return jsonify({"message": "No tracking details found for this tracking number"}), 404
        
        result = format_tracking_detail(tracking_detail)
        return jsonify(result), 200
    else:
        # Fetch all tracking details
        tracking_details = TrackingDetails.query.all()
        if not tracking_details:
            return jsonify({"message": "No tracking details found"}), 404
        
        result = [format_tracking_detail(detail) for detail in tracking_details]
        return jsonify(result), 200
    
    
@tracking.route("/create_tracking", methods=["POST"])
def create_tracking_detail():
    data = request.json

    # Check if all required fields are present
    required_fields = ['trackingNumber', 'lastRegisteredLocation', 'status']
    for field in required_fields:
        if field not in data:
            return jsonify({"message": f"Missing required field: {field}"}), 400

    # Check if a tracking detail with this number already exists
    existing_detail = TrackingDetails.query.get(data['trackingNumber'])
    if existing_detail:
        return jsonify({"message": "A tracking detail with this number already exists"}), 409

    # Create new tracking detail
    new_tracking_detail = TrackingDetails(
        trackingNumber=data['trackingNumber'],
        lastRegisteredLocation=data['lastRegisteredLocation'],
        estimatedDeliveryTime=data.get('estimatedDeliveryTime'),  # Optional field
        status=data['status'],
        deliveryPersonNumber=data.get('deliveryPersonNumber')  # Optional field
    )

    try:
        db.session.add(new_tracking_detail)
        db.session.commit()
        return jsonify(format_tracking_detail(new_tracking_detail)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while creating the tracking detail", "error": str(e)}), 500

def format_tracking_detail(detail):
    return {
        "trackingNumber": detail.trackingNumber,
        "lastRegisteredLocation": detail.lastRegisteredLocation,
        "estimatedDeliveryTime": detail.estimatedDeliveryTime,
        "status": detail.status,
        "deliveryPersonNumber": detail.deliveryPersonNumber
    }


