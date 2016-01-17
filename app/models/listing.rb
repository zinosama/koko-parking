class Listing < ActiveRecord::Base
	has_many :spots, dependent: :destroy
	has_many :bookings
end
