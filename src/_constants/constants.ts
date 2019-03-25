
export class Constants {
	
	REQUEST_STATUS_PENDING = 1;
	REQUEST_STATUS_DECLINED = 2;	
	REQUEST_STATUS_ACCEPTED = 3;
	REQUEST_STATUS_COMPLETED = 4;
	REQUEST_STATUS_CANCELLED = 5;
	REQUEST_STATUS_NOT_COMPLETED = 6;
	REQUEST_STATUS_RESOLVED_BUT_DISPUTED = 7;
	REQUEST_STATUS_DELETED = 8;
	REQUEST_STATUS_REQUESTOR_ACKNOWLEDGED = 9;
	REQUEST_STATUS_DECLINED_AND_HIDDEN = 10;

	INCOMING = "incoming";
	OUTGOING = "outgoing";

	//
	FUNCTION_KEY_OFFER_REQUIRES_RECOMMENDATIONS = 0;
	FUNCTION_KEY_USER_HAS_PREVIOUSLY_REQUESTED_OFFER = 1;
	FUNCTION_KEY_USER_IS_PAST_REQUEST_AGAIN_DATE = 2;
	FUNCTION_KEY_USER_HAS_NECESSARY_RECOMMENDATIONS = 3;
	FUNCTION_KEY_USER_HAS_CURRENTLY_REQUESTED_OFFER = 4;
	FUNCTION_KEY_USER_HAS_SUFFICIENT_POINTS = 5;
	FUNCTION_KEY_OFFER_IS_REQUESTABLE = 6;

	FUNCTION_KEY_MOST_RECENTLY_CREATED_OFFERS_GET = 7;

	//
	FUNCTION_KEY_REQUEST_IS_IN_PROGRESS = 0;
	FUNCTION_KEY_REQUESTS_BY_USER_AND_DIRECTION_GET = 1;

	//
	FUNCTION_KEY_CAN_SEND_POINT_TO_USER	= 0;
	FUNCTION_KEY_CAN_SEND_RECOMMENDATION_TO_USER = 1;


	//
	FUNCTION_KEY_PROFILE_PICTURE_GET = 0;
	FUNCTION_KEY_PROFILE_PICTURE_SET = 1;

	//
	FUNCTION_KEY_EXIF_METADATA_GET = 0;

	//
	PHOTO_TYPE_OFFER = "offer";
	//PHOTO_TYPE_PRM = 'prm';
	PHOTO_TYPE_PROFILE = 'profile';
}
