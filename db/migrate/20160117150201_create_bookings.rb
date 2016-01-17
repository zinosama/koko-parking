class CreateBookings < ActiveRecord::Migration
  def change
    create_table :bookings do |t|
    	t.float :total, null:false

    	t.references :listing, null:false
    	t.references :user, null:false
      t.timestamps null: false
    end
  end
end
