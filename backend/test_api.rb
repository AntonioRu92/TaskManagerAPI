#!/usr/bin/env ruby
# Script per testare l'API Task Manager con funzionalità di ricerca avanzata

require 'net/http'
require 'json'
require 'uri'

class TaskManagerAPITest
  BASE_URL = 'http://localhost:3001/api/v1'
  
  def initialize
    @uri = URI(BASE_URL)
    @http = Net::HTTP.new(@uri.host, @uri.port)
  end
  
  def test_get_tasks
    puts "\n🔍 Testing GET /api/v1/tasks..."
    
    request = Net::HTTP::Get.new('/api/v1/tasks')
    request['Content-Type'] = 'application/json'
    
    response = @http.request(request)
    puts "Status: #{response.code}"
    
    if response.code == '200'
      data = JSON.parse(response.body)
      puts "✅ Found #{data['tasks'].length} tasks"
      puts "📊 Meta: #{data['meta']}"
      puts "🔧 Applied filters: #{data['filters']}"
    else
      puts "❌ Error: #{response.body}"
    end
  end
  
  def test_search_functionality
    puts "\n🔍 Testing Search Functionality..."
    
    # Test ricerca generale
    request = Net::HTTP::Get.new('/api/v1/tasks?q=API')
    request['Content-Type'] = 'application/json'
    
    response = @http.request(request)
    puts "Status: #{response.code}"
    
    if response.code == '200'
      data = JSON.parse(response.body)
      puts "✅ Search 'API' found #{data['tasks'].length} tasks"
      
      if data['tasks'].any?
        task = data['tasks'].first
        puts "   First result: #{task['title']}"
        puts "   Highlighted: #{task['highlighted_title']}" if task['highlighted_title']
      end
    else
      puts "❌ Error: #{response.body}"
    end
  end
  
  def test_dedicated_search_endpoint
    puts "\n🔍 Testing GET /api/v1/tasks/search..."
    
    request = Net::HTTP::Get.new('/api/v1/tasks/search?q=test')
    request['Content-Type'] = 'application/json'
    
    response = @http.request(request)
    puts "Status: #{response.code}"
    
    if response.code == '200'
      data = JSON.parse(response.body)
      puts "✅ Dedicated search found #{data['tasks'].length} tasks"
      puts "🔍 Search query: #{data['search_query']}"
      puts "📋 Search fields: #{data['search_fields']}"
    else
      puts "❌ Error: #{response.body}"
    end
  end
  
  def test_filtering_options
    puts "\n🔧 Testing Advanced Filtering..."
    
    # Test filtro per stato completed
    request = Net::HTTP::Get.new('/api/v1/tasks?completed=true')
    request['Content-Type'] = 'application/json'
    
    response = @http.request(request)
    puts "Status: #{response.code}"
    
    if response.code == '200'
      data = JSON.parse(response.body)
      completed_tasks = data['tasks'].select { |task| task['completed'] }
      puts "✅ Found #{completed_tasks.length} completed tasks"
    else
      puts "❌ Error: #{response.body}"
    end
    
    # Test filtro per data
    puts "\n📅 Testing date filtering..."
    today = Date.today
    request = Net::HTTP::Get.new("/api/v1/tasks?created_after=#{today - 7}")
    request['Content-Type'] = 'application/json'
    
    response = @http.request(request)
    if response.code == '200'
      data = JSON.parse(response.body)
      puts "✅ Found #{data['tasks'].length} tasks created in last 7 days"
    else
      puts "❌ Error: #{response.body}"
    end
  end
  
  def test_sorting_options
    puts "\n📊 Testing Sorting Options..."
    
    # Test ordinamento per titolo
    request = Net::HTTP::Get.new('/api/v1/tasks?sort_by=title&sort_direction=asc')
    request['Content-Type'] = 'application/json'
    
    response = @http.request(request)
    puts "Status: #{response.code}"
    
    if response.code == '200'
      data = JSON.parse(response.body)
      puts "✅ Tasks sorted by title (ascending)"
      if data['tasks'].length > 1
        first_title = data['tasks'].first['title']
        last_title = data['tasks'].last['title']
        puts "   First: #{first_title}"
        puts "   Last: #{last_title}"
      end
    else
      puts "❌ Error: #{response.body}"
    end
  end
  
  def test_specific_field_search
    puts "\n🎯 Testing Specific Field Search..."
    
    # Test ricerca nel titolo
    request = Net::HTTP::Get.new('/api/v1/tasks?title=implementare')
    request['Content-Type'] = 'application/json'
    
    response = @http.request(request)
    if response.code == '200'
      data = JSON.parse(response.body)
      puts "✅ Title search found #{data['tasks'].length} tasks"
    end
    
    # Test ricerca nella descrizione
    request = Net::HTTP::Get.new('/api/v1/tasks?description=API')
    request['Content-Type'] = 'application/json'
    
    response = @http.request(request)
    if response.code == '200'
      data = JSON.parse(response.body)
      puts "✅ Description search found #{data['tasks'].length} tasks"
    end
  end
  
  def test_combined_filters
    puts "\n🔗 Testing Combined Filters..."
    
    # Test combinazione di filtri
    request = Net::HTTP::Get.new('/api/v1/tasks?q=API&completed=false&sort_by=created_at&sort_direction=desc')
    request['Content-Type'] = 'application/json'
    
    response = @http.request(request)
    puts "Status: #{response.code}"
    
    if response.code == '200'
      data = JSON.parse(response.body)
      puts "✅ Combined filters found #{data['tasks'].length} tasks"
      puts "🔧 Applied filters: #{data['filters']}"
    else
      puts "❌ Error: #{response.body}"
    end
  end
  
  def test_create_task
    puts "\n➕ Testing POST /api/v1/tasks..."
    
    task_data = {
      task: {
        title: "Task per test ricerca avanzata",
        description: "Questo task contiene parole chiave API, database, e testing per verificare la ricerca",
        completed: false
      }
    }
    
    request = Net::HTTP::Post.new('/api/v1/tasks')
    request['Content-Type'] = 'application/json'
    request.body = task_data.to_json
    
    response = @http.request(request)
    puts "Status: #{response.code}"
    
    if response.code == '201'
      data = JSON.parse(response.body)
      puts "✅ Task created with ID: #{data['task']['id']}"
      return data['task']['id']
    else
      puts "❌ Error: #{response.body}"
      return nil
    end
  end
  
  def test_get_single_task(id)
    puts "\n📋 Testing GET /api/v1/tasks/#{id}..."
    
    request = Net::HTTP::Get.new("/api/v1/tasks/#{id}")
    request['Content-Type'] = 'application/json'
    
    response = @http.request(request)
    puts "Status: #{response.code}"
    
    if response.code == '200'
      data = JSON.parse(response.body)
      puts "✅ Task found: #{data['task']['title']}"
    else
      puts "❌ Error: #{response.body}"
    end
  end
  
  def test_update_task(id)
    puts "\n✏️ Testing PATCH /api/v1/tasks/#{id}..."
    
    update_data = {
      task: {
        title: "Task aggiornato con ricerca",
        completed: true
      }
    }
    
    request = Net::HTTP::Patch.new("/api/v1/tasks/#{id}")
    request['Content-Type'] = 'application/json'
    request.body = update_data.to_json
    
    response = @http.request(request)
    puts "Status: #{response.code}"
    
    if response.code == '200'
      data = JSON.parse(response.body)
      puts "✅ Task updated: #{data['task']['title']} (completed: #{data['task']['completed']})"
    else
      puts "❌ Error: #{response.body}"
    end
  end
  
  def test_delete_task(id)
    puts "\n🗑 Testing DELETE /api/v1/tasks/#{id}..."
    
    request = Net::HTTP::Delete.new("/api/v1/tasks/#{id}")
    request['Content-Type'] = 'application/json'
    
    response = @http.request(request)
    puts "Status: #{response.code}"
    
    if response.code == '204'
      puts "✅ Task deleted successfully"
    else
      puts "❌ Error: #{response.body}"
    end
  end
  
  def run_all_tests
    puts "🚀 Starting Advanced Task Manager API Tests..."
    puts "Base URL: #{BASE_URL}"
    
    # Test basic functionality
    test_get_tasks
    
    # Test search and filtering
    test_search_functionality
    test_dedicated_search_endpoint
    test_filtering_options
    test_sorting_options
    test_specific_field_search
    test_combined_filters
    
    # Test CRUD operations
    task_id = test_create_task
    
    if task_id
      test_get_single_task(task_id)
      test_update_task(task_id)
      test_delete_task(task_id)
    end
    
    puts "\n✨ Advanced API Tests completed!"
    puts "\n📝 Available search and filter options:"
    puts "   • q=<text>              - General text search"
    puts "   • title=<text>          - Search in title only"
    puts "   • description=<text>    - Search in description only"
    puts "   • completed=true/false  - Filter by completion status"
    puts "   • created_after=YYYY-MM-DD   - Tasks created after date"
    puts "   • created_before=YYYY-MM-DD  - Tasks created before date"
    puts "   • sort_by=title|created_at|updated_at"
    puts "   • sort_direction=asc|desc"
    puts "   • page=<number>         - Pagination"
    puts "   • per_page=<number>     - Items per page"
    
  rescue => e
    puts "\n❌ Connection error: #{e.message}"
    puts "Make sure the Rails server is running on #{BASE_URL}"
  end
end

# Esegui i test se lo script viene chiamato direttamente
if __FILE__ == $0
  TaskManagerAPITest.new.run_all_tests
end
