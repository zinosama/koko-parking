class CreateSpots < ActiveRecord::Migration
  def change
    create_table :spots do |t|
    	t.integer :car_class, index:true
    	t.integer :spot_class
    	t.integer :d_price, index:true
    	t.integer :w_price
    	t.integer :m_price

    	t.boolean :instant, default:false, index:true
    	t.boolean :completed, default:false
    	t.boolean :published, default:false, index:true

    	t.references :listing, null:false
      t.timestamps null: false
    end
  end
end
