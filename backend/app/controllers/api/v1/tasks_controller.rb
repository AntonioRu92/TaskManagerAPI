class Api::V1::TasksController < ApplicationController
  before_action :set_task, only: [:show, :update, :destroy]

  # GET /api/v1/tasks
  def index
    @tasks = Task.all
    
    # Applica filtri e ricerca
    @tasks = apply_filters(@tasks)
    @tasks = apply_search(@tasks)
    @tasks = apply_sorting(@tasks)
    
    # Paginazione
    @tasks = @tasks.page(params[:page]).per(params[:per_page] || 10)
    
    render json: {
      tasks: @tasks.map { |task| task_json(task, include_search_highlights: search_params[:q].present?) },
      meta: pagination_meta(@tasks),
      filters: applied_filters_summary
    }
  end

  # GET /api/v1/tasks/:id
  def show
    render json: { task: task_json(@task) }
  end

  # POST /api/v1/tasks
  def create
    @task = Task.new(task_params)

    if @task.save
      render json: { task: task_json(@task) }, status: :created
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/tasks/:id
  def update
    if @task.update(task_params)
      render json: { task: task_json(@task) }
    else
      render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/tasks/:id
  def destroy
    @task.destroy
    head :no_content
  end

  # GET /api/v1/tasks/search
  def search
    @tasks = Task.all
    @tasks = apply_search(@tasks)
    @tasks = apply_sorting(@tasks)
    @tasks = @tasks.page(params[:page]).per(params[:per_page] || 10)
    
    render json: {
      tasks: @tasks.map { |task| task_json(task, include_search_highlights: true) },
      meta: pagination_meta(@tasks),
      search_query: search_params[:q],
      search_fields: search_params.except(:q).keys
    }
  end

  private

  def set_task
    @task = Task.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Task not found' }, status: :not_found
  end

  def task_params
    params.require(:task).permit(:title, :description, :completed)
  end

  def search_params
    params.permit(:q, :title, :description, :completed, :created_after, :created_before, 
                  :created_from, :created_to, :sort_by, :sort_direction)
  end

  def apply_filters(tasks)
    # Filtra per stato completed
    if params[:completed].present?
      case params[:completed].downcase
      when 'true'
        tasks = tasks.completed
      when 'false'
        tasks = tasks.pending
      end
    end
    
    # Filtra per data di creazione
    if params[:created_after].present?
      begin
        date = Date.parse(params[:created_after])
        tasks = tasks.created_after(date)
      rescue ArgumentError
        # Ignora date non valide
      end
    end
    
    if params[:created_before].present?
      begin
        date = Date.parse(params[:created_before])
        tasks = tasks.created_before(date)
      rescue ArgumentError
        # Ignora date non valide
      end
    end
    
    # Filtra per range di date (alternativo)
    if params[:created_from].present? && params[:created_to].present?
      begin
        start_date = Date.parse(params[:created_from])
        end_date = Date.parse(params[:created_to])
        tasks = tasks.created_between(start_date, end_date)
      rescue ArgumentError
        # Ignora date non valide
      end
    end
    
    tasks
  end

  def apply_search(tasks)
    # Ricerca testuale generale
    if params[:q].present?
      tasks = tasks.search_text(params[:q])
    end
    
    # Ricerca specifica nel titolo
    if params[:title].present?
      tasks = tasks.search_by_title(params[:title])
    end
    
    # Ricerca specifica nella descrizione
    if params[:description].present?
      tasks = tasks.search_by_description(params[:description])
    end
    
    tasks
  end

  def apply_sorting(tasks)
    sort_by = params[:sort_by] || 'created_at'
    sort_direction = params[:sort_direction] || 'desc'
    
    case sort_by.downcase
    when 'title'
      tasks.ordered_by_title(sort_direction)
    when 'updated_at'
      tasks.ordered_by_updated(sort_direction)
    when 'created_at'
      tasks.ordered_by_created(sort_direction)
    else
      tasks.ordered_by_created(sort_direction)
    end
  end

  def task_json(task, include_search_highlights: false)
    base_json = {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      created_at: task.created_at,
      updated_at: task.updated_at
    }
    
    # Aggiungi evidenziazioni per la ricerca se richiesto
    if include_search_highlights && params[:q].present?
      base_json[:highlighted_title] = task.highlighted_title(params[:q])
      base_json[:description_excerpt] = task.description_excerpt(params[:q])
    end
    
    base_json
  end

  def pagination_meta(collection)
    {
      current_page: collection.current_page,
      total_pages: collection.total_pages,
      total_count: collection.total_count,
      per_page: collection.limit_value
    }
  end
  
  def applied_filters_summary
    filters = {}
    
    filters[:completed] = params[:completed] if params[:completed].present?
    filters[:created_after] = params[:created_after] if params[:created_after].present?
    filters[:created_before] = params[:created_before] if params[:created_before].present?
    filters[:created_from] = params[:created_from] if params[:created_from].present?
    filters[:created_to] = params[:created_to] if params[:created_to].present?
    filters[:search_query] = params[:q] if params[:q].present?
    filters[:title_search] = params[:title] if params[:title].present?
    filters[:description_search] = params[:description] if params[:description].present?
    filters[:sort_by] = params[:sort_by] || 'created_at'
    filters[:sort_direction] = params[:sort_direction] || 'desc'
    
    filters
  end
end
