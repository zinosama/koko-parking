class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
    	t.string :fire_ref, null:false, index:true

      t.timestamps null: false
    end
  end
end
