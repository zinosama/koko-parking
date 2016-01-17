class Spot < ActiveRecord::Base
	has_many :slots, dependent: :destroy
	belongs_to :listing
end
