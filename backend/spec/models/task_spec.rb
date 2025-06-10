require 'rails_helper'

RSpec.describe Task, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:title) }
    it { should validate_length_of(:title).is_at_most(255) }
    it { should validate_inclusion_of(:completed).in_array([true, false]) }
  end

  describe 'scopes' do
    let!(:completed_task) { create(:task, :completed) }
    let!(:pending_task) { create(:task, :pending) }

    describe '.completed' do
      it 'returns completed tasks' do
        expect(Task.completed).to include(completed_task)
        expect(Task.completed).not_to include(pending_task)
      end
    end

    describe '.pending' do
      it 'returns pending tasks' do
        expect(Task.pending).to include(pending_task)
        expect(Task.pending).not_to include(completed_task)
      end
    end
  end

  describe 'search scopes' do
    let!(:task1) { create(:task, title: "Implementare API REST", description: "Creare endpoint per gestione utenti") }
    let!(:task2) { create(:task, title: "Testing dell'applicazione", description: "Scrivere test unitari completi") }
    let!(:task3) { create(:task, title: "Deploy in produzione", description: "Configurare server e API gateway") }

    describe '.search_by_title' do
      it 'finds tasks by title' do
        results = Task.search_by_title("API")
        expect(results).to include(task1, task3)
        expect(results).not_to include(task2)
      end

      it 'is case insensitive' do
        results = Task.search_by_title("api")
        expect(results).to include(task1, task3)
      end

      it 'returns all tasks when query is blank' do
        results = Task.search_by_title("")
        expect(results).to include(task1, task2, task3)
      end
    end

    describe '.search_by_description' do
      it 'finds tasks by description' do
        results = Task.search_by_description("test")
        expect(results).to include(task2)
        expect(results).not_to include(task1, task3)
      end

      it 'is case insensitive' do
        results = Task.search_by_description("TEST")
        expect(results).to include(task2)
      end
    end

    describe '.search_text' do
      it 'searches in both title and description' do
        results = Task.search_text("API")
        expect(results).to include(task1, task3)
        expect(results).not_to include(task2)
      end

      it 'finds tasks with search term in description' do
        results = Task.search_text("test")
        expect(results).to include(task2)
        expect(results).not_to include(task1, task3)
      end
    end
  end

  describe 'date scopes' do
    let!(:old_task) { create(:task, created_at: 1.week.ago) }
    let!(:recent_task) { create(:task, created_at: 1.day.ago) }
    let!(:today_task) { create(:task, created_at: Time.current) }

    describe '.created_after' do
      it 'finds tasks created after specified date' do
        results = Task.created_after(2.days.ago)
        expect(results).to include(recent_task, today_task)
        expect(results).not_to include(old_task)
      end
    end

    describe '.created_before' do
      it 'finds tasks created before specified date' do
        results = Task.created_before(2.days.ago)
        expect(results).to include(old_task)
        expect(results).not_to include(recent_task, today_task)
      end
    end

    describe '.created_between' do
      it 'finds tasks created between specified dates' do
        results = Task.created_between(3.days.ago, 12.hours.ago)
        expect(results).to include(recent_task)
        expect(results).not_to include(old_task, today_task)
      end
    end
  end

  describe 'ordering scopes' do
    let!(:task_a) { create(:task, title: "Alpha Task", created_at: 2.days.ago, updated_at: 1.hour.ago) }
    let!(:task_b) { create(:task, title: "Beta Task", created_at: 1.day.ago, updated_at: 2.hours.ago) }
    let!(:task_c) { create(:task, title: "Charlie Task", created_at: 3.days.ago, updated_at: 30.minutes.ago) }

    describe '.ordered_by_title' do
      it 'orders by title ascending by default' do
        results = Task.ordered_by_title
        expect(results.pluck(:title)).to eq(["Alpha Task", "Beta Task", "Charlie Task"])
      end

      it 'orders by title descending when specified' do
        results = Task.ordered_by_title('desc')
        expect(results.pluck(:title)).to eq(["Charlie Task", "Beta Task", "Alpha Task"])
      end
    end

    describe '.ordered_by_created' do
      it 'orders by created_at descending by default' do
        results = Task.ordered_by_created
        expect(results).to eq([task_b, task_a, task_c])
      end

      it 'orders by created_at ascending when specified' do
        results = Task.ordered_by_created('asc')
        expect(results).to eq([task_c, task_a, task_b])
      end
    end

    describe '.ordered_by_updated' do
      it 'orders by updated_at descending by default' do
        results = Task.ordered_by_updated
        expect(results).to eq([task_c, task_a, task_b])
      end
    end
  end

  describe '#toggle_completion!' do
    let(:task) { create(:task, completed: false) }

    it 'toggles the completion status from false to true' do
      expect { task.toggle_completion! }.to change { task.completed }.from(false).to(true)
    end

    it 'toggles the completion status from true to false' do
      task.update!(completed: true)
      expect { task.toggle_completion! }.to change { task.completed }.from(true).to(false)
    end
  end

  describe '#highlighted_title' do
    let(:task) { create(:task, title: "Implementare API REST") }

    it 'highlights search terms in title' do
      result = task.highlighted_title("API")
      expect(result).to eq("Implementare <mark>API</mark> REST")
    end

    it 'returns original title when no search term' do
      result = task.highlighted_title("")
      expect(result).to eq(task.title)
    end

    it 'is case insensitive' do
      result = task.highlighted_title("api")
      expect(result).to eq("Implementare <mark>api</mark> REST")
    end
  end

  describe '#description_excerpt' do
    let(:task) { create(:task, description: "Questa è una descrizione molto lunga che dovrebbe essere troncata quando supera la lunghezza massima specificata per l'estratto del testo") }

    it 'returns truncated description without search term' do
      result = task.description_excerpt(nil, 50)
      expect(result.length).to be <= 53 # 50 + "..."
    end

    it 'highlights search term in excerpt' do
      result = task.description_excerpt("descrizione", 100)
      expect(result).to include("<mark>descrizione</mark>")
    end

    it 'positions excerpt around search term' do
      long_desc = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
      task.update!(description: long_desc)
      
      result = task.description_excerpt("consectetur", 50)
      expect(result).to include("consectetur")
      expect(result).to include("<mark>consectetur</mark>")
    end
  end

  describe 'default values' do
    it 'sets completed to false by default' do
      new_task = Task.create!(title: 'Test Task')
      expect(new_task.completed).to be false
    end
  end
end
