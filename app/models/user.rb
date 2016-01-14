class User < ActiveRecord::Base
	has_many :listings, dependent: :destroy

	validates :fire_ref, uniqueness: true
end
