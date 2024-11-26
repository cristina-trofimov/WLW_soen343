from flask import Blueprint
from flask import Flask, jsonify, request
from models import DeliveryStatusEnum, db, TrackingDetails
from sqlalchemy.orm import joinedload
from datetime import datetime


tracking = Blueprint('tracking', __name__)


@tracking.route("/tracking_details", methods=["GET"])
def get_tracking_details():
    tracking_number = request.args.get('trackingNumber')

    def check_and_update_status(tracking_detail):
        # Check if estimatedDeliveryTime exists and has passed
        if tracking_detail.estimatedDeliveryTime:
            try:
                estimated_date = datetime.strptime(tracking_detail.estimatedDeliveryTime, "%B %d, %Y")
                if estimated_date < datetime.now() and tracking_detail.status != "Delivered":
                    # Update status to Delivered if the date has passed
                    tracking_detail.status = "Delivered"
                    db.session.commit()
            except ValueError:
                # Log or handle invalid date format
                return jsonify({"message": "Invalid date format in database."}), 500

    if tracking_number:
        # Fetch tracking details for a specific tracking number
        tracking_detail = TrackingDetails.query.get(tracking_number)
        if not tracking_detail:
            return jsonify({"message": "No tracking details found for this tracking number"}), 404

        # Check and update the status if needed
        check_and_update_status(tracking_detail)

        result = format_tracking_detail(tracking_detail)
        return jsonify(result), 200
    else:
        # Fetch all tracking details
        tracking_details = TrackingDetails.query.all()
        if not tracking_details:
            return jsonify({"message": "No tracking details found"}), 404

        # Check and update the status for each tracking detail
        for detail in tracking_details:
            check_and_update_status(detail)

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


@tracking.route('/update_tracking_details', methods=['POST'])
def update_tracking_details():
    # Get form data from the request JSON
    data = request.json
    
    tracking_number = data.get('trackingNumber')
    last_registered_location = data.get('lastRegisteredLocation')
    estimated_delivery_time = data.get('estimatedDeliveryTime')
    status = data.get('status')
    delivery_person_number = data.get('deliveryPersonNumber')
    
    # Validate inputs
    if not tracking_number:
        return jsonify({"status": "error", "message": "Tracking number is required."}), 400
    
    try:
        # Find the tracking details by trackingNumber
        tracking_details = TrackingDetails.query.filter_by(trackingNumber=tracking_number).first()
        
        if not tracking_details:
            return jsonify({"status": "error", "message": "Tracking number not found."}), 404
        
        # Conditionally update the tracking details only if the field is provided in the request
        if last_registered_location is not None:
            tracking_details.lastRegisteredLocation = last_registered_location
        if estimated_delivery_time is not None:
            tracking_details.estimatedDeliveryTime = estimated_delivery_time
        if status is not None:
            # Validate the status against the enum values
            if status not in [item.value for item in DeliveryStatusEnum]:
                return jsonify({"status": "error", "message": f"Invalid status value: {status}. Valid values are: {[item.value for item in DeliveryStatusEnum]}"}), 400
            tracking_details.status = status
        if delivery_person_number is not None:
            tracking_details.deliveryPersonNumber = delivery_person_number
        
        # Commit the changes to the database
        db.session.commit()
        
        return jsonify({"status": "success", "message": "Tracking details updated successfully."}), 200
    
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500