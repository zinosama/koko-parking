class User < ActiveRecord::Base
	has_many :listings, dependent: :destroy
	has_many :bookings, dependent: :destroy
	
	validates :fire_ref, uniqueness: true
end
