class Listing < ActiveRecord::Base
	has_many :spots, dependent: :destroy
end
