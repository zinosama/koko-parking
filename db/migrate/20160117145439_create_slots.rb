class CreateSlots < ActiveRecord::Migration
  def change
    create_table :slots do |t|
    	t.boolean :booked, default:false
    	t.boolean :unavailable, default:false

    	t.date :start_time
    	t.date :end_time

    	t.references :spot, null:false
    	t.references :booking
      t.timestamps null: false
    end
  end
end
