# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Crea alcuni task di esempio per lo sviluppo
if Rails.env.development?
  puts "Creazione task di esempio per testare ricerca e filtraggio..."
  
  # Task di sviluppo
  Task.find_or_create_by(title: "Implementare autenticazione utente") do |task|
    task.description = "Aggiungere sistema di login e registrazione con JWT per sicurezza API"
    task.completed = false
    task.created_at = 1.week.ago
  end
  
  Task.find_or_create_by(title: "Scrivere documentazione API completa") do |task|
    task.description = "Documentare tutti gli endpoints con esempi dettagliati di richieste e risposte JSON"
    task.completed = true
    task.created_at = 2.days.ago
  end
  
  Task.find_or_create_by(title: "Configurare pipeline CI/CD") do |task|
    task.description = "Impostare continuous integration e deployment con GitHub Actions"
    task.completed = false
    task.created_at = 5.days.ago
  end
  
  Task.find_or_create_by(title: "Ottimizzare performance database PostgreSQL") do |task|
    task.description = "Aggiungere indici strategici e ottimizzare query complesse per migliorare le performance"
    task.completed = true
    task.created_at = 1.day.ago
  end
  
  Task.find_or_create_by(title: "Implementare rate limiting per API") do |task|
    task.description = "Aggiungere limitazione alle richieste per prevenire abusi e attacchi DDoS"
    task.completed = false
    task.created_at = 3.days.ago
  end
  
  # Task di design e UI
  Task.find_or_create_by(title: "Progettare interfaccia utente moderna") do |task|
    task.description = "Creare mockup e prototipi per una UI responsive e user-friendly"
    task.completed = false
    task.created_at = 4.days.ago
  end
  
  Task.find_or_create_by(title: "Implementare tema scuro per applicazione") do |task|
    task.description = "Aggiungere supporto per modalità scura con toggle automatico basato su preferenze sistema"
    task.completed = true
    task.created_at = 6.days.ago
  end
  
  # Task di testing
  Task.find_or_create_by(title: "Scrivere test di integrazione completi") do |task|
    task.description = "Creare suite di test end-to-end per tutti i flussi principali dell'applicazione"
    task.completed = false
    task.created_at = 1.hour.ago
  end
  
  Task.find_or_create_by(title: "Configurare code coverage reporting") do |task|
    task.description = "Implementare strumenti per monitorare la copertura dei test e generare report dettagliati"
    task.completed = true
    task.created_at = 2.hours.ago
  end
  
  # Task di deployment
  Task.find_or_create_by(title: "Configurare environment di staging") do |task|
    task.description = "Preparare ambiente di pre-produzione per testing finale prima del deploy"
    task.completed = false
    task.created_at = 30.minutes.ago
  end
  
  Task.find_or_create_by(title: "Setup monitoraggio e logging produzione") do |task|
    task.description = "Implementare Sentry per error tracking e New Relic per performance monitoring"
    task.completed = false
    task.created_at = 10.days.ago
  end
  
  # Task di sicurezza
  Task.find_or_create_by(title: "Audit sicurezza applicazione") do |task|
    task.description = "Eseguire penetration testing e vulnerability assessment completo"
    task.completed = true
    task.created_at = 8.days.ago
  end
  
  puts "✅ Creati #{Task.count} task di esempio con date e contenuti diversificati"
  puts "📊 Task completati: #{Task.completed.count}"
  puts "⏳ Task in sospeso: #{Task.pending.count}"
end
