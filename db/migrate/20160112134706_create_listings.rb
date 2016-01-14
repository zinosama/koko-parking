class CreateListings < ActiveRecord::Migration
  def change
    create_table :listings do |t|
    	t.float :lat, null:false, index:true
    	t.float :lng, null:false, index:true

    	t.string :address, null:false
    	t.string :transit_info
    	t.string :rules
    	t.string :other_info

    	t.boolean :published, default:false, index:true
    	t.boolean :completed, default:false

    	t.references :user, null:false
      t.timestamps null: false
    end
  end
end
