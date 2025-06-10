require 'rails_helper'

RSpec.describe 'Api::V1::Tasks', type: :request do
  let(:valid_attributes) { { title: 'Test Task', description: 'Test Description' } }
  let(:invalid_attributes) { { title: '' } }
  let(:headers) { { 'Content-Type' => 'application/json' } }

  describe 'GET /api/v1/tasks' do
    let!(:tasks) { create_list(:task, 3) }

    it 'returns all tasks with filter summary' do
      get '/api/v1/tasks', headers: headers
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['tasks'].length).to eq(3)
      expect(json['meta']).to be_present
      expect(json['filters']).to be_present
    end

    context 'with completed filter' do
      let!(:completed_task) { create(:task, :completed) }
      let!(:pending_task) { create(:task, :pending) }

      it 'filters by completed=true' do
        get '/api/v1/tasks', params: { completed: 'true' }, headers: headers
        json = JSON.parse(response.body)
        completed_count = json['tasks'].count { |task| task['completed'] == true }
        expect(completed_count).to be > 0
        expect(json['filters']['completed']).to eq('true')
      end

      it 'filters by completed=false' do
        get '/api/v1/tasks', params: { completed: 'false' }, headers: headers
        json = JSON.parse(response.body)
        pending_count = json['tasks'].count { |task| task['completed'] == false }
        expect(pending_count).to be > 0
        expect(json['filters']['completed']).to eq('false')
      end
    end

    context 'with text search' do
      let!(:api_task) { create(:task, title: "Implementare API REST", description: "Creare endpoint") }
      let!(:test_task) { create(:task, title: "Scrivere test", description: "Test unitari e integrazione") }

      it 'searches by general query' do
        get '/api/v1/tasks', params: { q: 'API' }, headers: headers
        json = JSON.parse(response.body)
        expect(json['tasks'].length).to eq(1)
        expect(json['tasks'][0]['title']).to include('API')
        expect(json['filters']['search_query']).to eq('API')
      end

      it 'searches specifically in title' do
        get '/api/v1/tasks', params: { title: 'test' }, headers: headers
        json = JSON.parse(response.body)
        expect(json['tasks'].length).to eq(1)
        expect(json['tasks'][0]['title']).to include('test')
      end

      it 'searches specifically in description' do
        get '/api/v1/tasks', params: { description: 'endpoint' }, headers: headers
        json = JSON.parse(response.body)
        expect(json['tasks'].length).to eq(1)
        expect(json['tasks'][0]['description']).to include('endpoint')
      end
    end

    context 'with date filters' do
      let!(:old_task) { create(:task, title: "Old Task", created_at: 1.week.ago) }
      let!(:recent_task) { create(:task, title: "Recent Task", created_at: 1.day.ago) }

      it 'filters by created_after' do
        get '/api/v1/tasks', params: { created_after: 2.days.ago.to_date }, headers: headers
        json = JSON.parse(response.body)
        titles = json['tasks'].map { |t| t['title'] }
        expect(titles).to include('Recent Task')
        expect(titles).not_to include('Old Task')
      end

      it 'filters by created_before' do
        get '/api/v1/tasks', params: { created_before: 2.days.ago.to_date }, headers: headers
        json = JSON.parse(response.body)
        titles = json['tasks'].map { |t| t['title'] }
        expect(titles).to include('Old Task')
        expect(titles).not_to include('Recent Task')
      end

      it 'filters by date range' do
        get '/api/v1/tasks', params: { 
          created_from: 3.days.ago.to_date, 
          created_to: 12.hours.ago.to_date 
        }, headers: headers
        json = JSON.parse(response.body)
        titles = json['tasks'].map { |t| t['title'] }
        expect(titles).to include('Recent Task')
        expect(titles).not_to include('Old Task')
      end
    end

    context 'with sorting' do
      let!(:task_a) { create(:task, title: "Alpha Task", created_at: 2.days.ago) }
      let!(:task_b) { create(:task, title: "Beta Task", created_at: 1.day.ago) }

      it 'sorts by title ascending' do
        get '/api/v1/tasks', params: { sort_by: 'title', sort_direction: 'asc' }, headers: headers
        json = JSON.parse(response.body)
        titles = json['tasks'].map { |t| t['title'] }
        expect(titles.first).to eq('Alpha Task')
      end

      it 'sorts by title descending' do
        get '/api/v1/tasks', params: { sort_by: 'title', sort_direction: 'desc' }, headers: headers
        json = JSON.parse(response.body)
        titles = json['tasks'].map { |t| t['title'] }
        expect(titles.first).to eq('Beta Task')
      end

      it 'sorts by created_at by default' do
        get '/api/v1/tasks', headers: headers
        json = JSON.parse(response.body)
        expect(json['filters']['sort_by']).to eq('created_at')
        expect(json['filters']['sort_direction']).to eq('desc')
      end
    end

    context 'with pagination' do
      let!(:tasks) { create_list(:task, 15) }

      it 'paginates results' do
        get '/api/v1/tasks', params: { page: 1, per_page: 5 }, headers: headers
        json = JSON.parse(response.body)
        expect(json['tasks'].length).to eq(5)
        expect(json['meta']['current_page']).to eq(1)
        expect(json['meta']['per_page']).to eq(5)
      end
    end
  end

  describe 'GET /api/v1/tasks/search' do
    let!(:api_task) { create(:task, title: "API Development", description: "Build REST API") }
    let!(:ui_task) { create(:task, title: "UI Design", description: "Create user interface") }

    it 'returns search results with highlights' do
      get '/api/v1/tasks/search', params: { q: 'API' }, headers: headers
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      
      expect(json['tasks'].length).to eq(1)
      expect(json['search_query']).to eq('API')
      expect(json['tasks'][0]['highlighted_title']).to include('<mark>API</mark>')
    end

    it 'returns empty results for non-matching search' do
      get '/api/v1/tasks/search', params: { q: 'NonExistent' }, headers: headers
      json = JSON.parse(response.body)
      expect(json['tasks']).to be_empty
    end

    it 'includes search metadata' do
      get '/api/v1/tasks/search', params: { q: 'API', title: 'dev' }, headers: headers
      json = JSON.parse(response.body)
      expect(json['search_query']).to eq('API')
      expect(json['search_fields']).to include('title')
    end
  end

  describe 'GET /api/v1/tasks/:id' do
    let(:task) { create(:task) }

    it 'returns the task' do
      get "/api/v1/tasks/#{task.id}", headers: headers
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['task']['id']).to eq(task.id)
      expect(json['task']['title']).to eq(task.title)
    end

    it 'returns 404 for non-existent task' do
      get '/api/v1/tasks/999999', headers: headers
      expect(response).to have_http_status(:not_found)
      json = JSON.parse(response.body)
      expect(json['error']).to be_present
    end
  end

  describe 'POST /api/v1/tasks' do
    context 'with valid parameters' do
      it 'creates a new task' do
        expect {
          post '/api/v1/tasks', 
               params: { task: valid_attributes }.to_json, 
               headers: headers
        }.to change(Task, :count).by(1)
        
        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json['task']['title']).to eq(valid_attributes[:title])
        expect(json['task']['completed']).to be false
      end
    end

    context 'with invalid parameters' do
      it 'returns validation errors' do
        post '/api/v1/tasks', 
             params: { task: invalid_attributes }.to_json, 
             headers: headers
             
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['errors']).to be_present
        expect(json['errors']).to include("Title can't be blank")
      end
    end
  end

  describe 'PATCH /api/v1/tasks/:id' do
    let(:task) { create(:task) }

    context 'with valid parameters' do
      it 'updates the task' do
        patch "/api/v1/tasks/#{task.id}", 
              params: { task: { title: 'Updated Title' } }.to_json, 
              headers: headers
              
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['task']['title']).to eq('Updated Title')
        
        task.reload
        expect(task.title).to eq('Updated Title')
      end

      it 'can toggle completion status' do
        patch "/api/v1/tasks/#{task.id}", 
              params: { task: { completed: true } }.to_json, 
              headers: headers
              
        expect(response).to have_http_status(:ok)
        task.reload
        expect(task.completed).to be true
      end
    end

    context 'with invalid parameters' do
      it 'returns validation errors' do
        patch "/api/v1/tasks/#{task.id}", 
              params: { task: { title: '' } }.to_json, 
              headers: headers
              
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['errors']).to be_present
      end
    end

    it 'returns 404 for non-existent task' do
      patch '/api/v1/tasks/999999', 
            params: { task: { title: 'Updated' } }.to_json, 
            headers: headers
            
      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'DELETE /api/v1/tasks/:id' do
    let!(:task) { create(:task) }

    it 'deletes the task' do
      expect {
        delete "/api/v1/tasks/#{task.id}", headers: headers
      }.to change(Task, :count).by(-1)
      
      expect(response).to have_http_status(:no_content)
    end

    it 'returns 404 for non-existent task' do
      delete '/api/v1/tasks/999999', headers: headers
      expect(response).to have_http_status(:not_found)
    end
  end
end
