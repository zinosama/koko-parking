class Booking < ActiveRecord::Base
	belongs_to :listing
	belongs_to :user
	has_many :slots, dependent: :destroy
end
