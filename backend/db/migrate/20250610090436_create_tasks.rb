class CreateTasks < ActiveRecord::Migration[8.0]
  def change
    create_table :tasks do |t|
      t.string :title, null: false
      t.text :description
      t.boolean :completed, default: false, null: false

      t.timestamps
    end
    
    add_index :tasks, :completed
  end
end
