class Task < ApplicationRecord
  validates :title, presence: true, length: { minimum: 1, maximum: 255 }
  validates :completed, inclusion: { in: [true, false] }
  
  # Scope per stato
  scope :completed, -> { where(completed: true) }
  scope :pending, -> { where(completed: false) }
  
  # Scope per ricerca testuale
  scope :search_by_title, ->(query) {
    where("title ILIKE ?", "%#{sanitize_sql_like(query)}%") if query.present?
  }
  
  scope :search_by_description, ->(query) {
    where("description ILIKE ?", "%#{sanitize_sql_like(query)}%") if query.present?
  }
  
  scope :search_text, ->(query) {
    return all if query.blank?
    
    where(
      "title ILIKE ? OR description ILIKE ?",
      "%#{sanitize_sql_like(query)}%",
      "%#{sanitize_sql_like(query)}%"
    )
  }
  
  # Scope per data di creazione
  scope :created_after, ->(date) {
    where("created_at >= ?", date) if date.present?
  }
  
  scope :created_before, ->(date) {
    where("created_at <= ?", date) if date.present?
  }
  
  scope :created_between, ->(start_date, end_date) {
    where(created_at: start_date..end_date) if start_date.present? && end_date.present?
  }
  
  # Scope per ordinamento
  scope :ordered_by_created, ->(direction = 'desc') {
    direction = direction.downcase == 'asc' ? 'asc' : 'desc'
    order("created_at #{direction}")
  }
  
  scope :ordered_by_title, ->(direction = 'asc') {
    direction = direction.downcase == 'desc' ? 'desc' : 'asc'
    order("title #{direction}")
  }
  
  scope :ordered_by_updated, ->(direction = 'desc') {
    direction = direction.downcase == 'asc' ? 'asc' : 'desc'
    order("updated_at #{direction}")
  }
  
  def toggle_completion!
    update!(completed: !completed)
  end
  
  # Metodo per evidenziare i termini di ricerca nel titolo
  def highlighted_title(search_term = nil)
    return title if search_term.blank?
    
    title.gsub(/(#{Regexp.escape(search_term)})/i, '<mark>\1</mark>')
  end
  
  # Metodo per ottenere un estratto della descrizione con evidenziazione
  def description_excerpt(search_term = nil, length = 150)
    return description&.truncate(length) if search_term.blank? || description.blank?
    
    # Trova la posizione del termine di ricerca
    search_index = description.downcase.index(search_term.downcase)
    
    if search_index
      # Calcola l'inizio dell'estratto
      start_pos = [0, search_index - 50].max
      excerpt = description[start_pos, length]
      
      # Evidenzia il termine di ricerca
      excerpt.gsub(/(#{Regexp.escape(search_term)})/i, '<mark>\1</mark>')
    else
      description.truncate(length)
    end
  end
end
