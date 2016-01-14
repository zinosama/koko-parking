# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160112143356) do

  create_table "listings", force: :cascade do |t|
    t.float    "lat",                          null: false
    t.float    "lng",                          null: false
    t.string   "address",                      null: false
    t.string   "transit_info"
    t.string   "rules"
    t.string   "other_info"
    t.boolean  "published",    default: false
    t.boolean  "completed",    default: false
    t.integer  "user_id",                      null: false
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
  end

  add_index "listings", ["lat"], name: "index_listings_on_lat"
  add_index "listings", ["lng"], name: "index_listings_on_lng"
  add_index "listings", ["published"], name: "index_listings_on_published"

  create_table "spots", force: :cascade do |t|
    t.integer  "car_class"
    t.integer  "spot_class"
    t.integer  "d_price"
    t.integer  "w_price"
    t.integer  "m_price"
    t.boolean  "instant",    default: false
    t.boolean  "completed",  default: false
    t.boolean  "published",  default: false
    t.integer  "listing_id",                 null: false
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  add_index "spots", ["car_class"], name: "index_spots_on_car_class"
  add_index "spots", ["d_price"], name: "index_spots_on_d_price"
  add_index "spots", ["instant"], name: "index_spots_on_instant"
  add_index "spots", ["published"], name: "index_spots_on_published"

  create_table "users", force: :cascade do |t|
    t.string   "fire_ref",   null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "users", ["fire_ref"], name: "index_users_on_fire_ref"

end
