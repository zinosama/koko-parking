class Slot < ActiveRecord::Base
	belongs_to :spot
	belongs_to :booking
end
