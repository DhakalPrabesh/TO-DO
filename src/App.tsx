import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, addDays, addMinutes, isAfter, isBefore } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Todo, TodoState } from './types';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaBell } from 'react-icons/fa';

const MainContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  position: relative;
  background: url('/dc56c164-98b9-4762-9c02-f6a3d6fc6512.jpg') no-repeat center center fixed;
  background-size: cover;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1;
  }
`;

const AppContainer = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #fff;
  background: rgba(26, 26, 46, 0.7);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #fff;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 
    0 0 10px rgba(52, 152, 219, 0.5),
    0 0 20px rgba(52, 152, 219, 0.3),
    0 0 30px rgba(52, 152, 219, 0.2);
  letter-spacing: 2px;
`;

const TodoForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 0 20px rgba(52, 152, 219, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  backdrop-filter: blur(5px);

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  backdrop-filter: blur(5px);

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' | 'success' }>`
  padding: 0.6rem 1.2rem;
  background-color: ${props => {
    switch (props.variant) {
      case 'danger':
        return '#e74c3c';
      case 'success':
        return '#2ecc71';
      default:
        return '#3498db';
    }
  }};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => {
      switch (props.variant) {
        case 'danger':
          return '#c0392b';
        case 'success':
          return '#27ae60';
        default:
          return '#2980b9';
      }
    }};
  }
`;

const TodoList = styled.div`
  display: grid;
  gap: 1rem;
`;

const TodoItem = styled.div<{ completed: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 0 15px rgba(52, 152, 219, 0.15);
  opacity: ${props => props.completed ? 0.7 : 1};
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 6px 8px rgba(0, 0, 0, 0.2),
      0 0 20px rgba(52, 152, 219, 0.25);
  }
`;

const TodoContent = styled.div`
  flex: 1;
`;

const TodoActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: start;
`;

const IconButton = styled.button<{ color?: string }>`
  background: none;
  border: none;
  color: ${props => props.color || '#3498db'};
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.2rem;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const NotificationBadge = styled.span`
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
  position: absolute;
  top: -5px;
  right: -5px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const NotificationSettings = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const DateTimeInput = styled(Input)`
  cursor: pointer;
  
  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }

  &:focus {
    color: #fff;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const ConfirmDialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(26, 26, 46, 0.95);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  z-index: 1000;
  color: white;
  text-align: center;
`;

const ConfirmOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
`;

const App: React.FC = () => {
  const [state, setState] = useState<TodoState>({
    todos: [],
    currentPage: 1,
    itemsPerPage: 5,
    searchQuery: ''
  });

  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setState(prev => ({
        ...prev,
        todos: JSON.parse(savedTodos).map((todo: any) => ({
          ...todo,
          dueDate: new Date(todo.dueDate)
        }))
      }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(state.todos));
  }, [state.todos]);

  // Notification checker
  useEffect(() => {
    const notificationInterval = setInterval(() => {
      state.todos.forEach(todo => {
        if (!todo.completed && todo.notificationSettings.enabled) {
          const now = new Date();
          const dueDate = new Date(todo.dueDate);

          switch (todo.notificationSettings.type) {
            case 'daily':
              if (isBefore(dueDate, addDays(now, 1))) {
                toast.info(`Daily Reminder: "${todo.title}" is due ${format(dueDate, 'PPp')}`);
              }
              break;
            case 'weekly':
              if (isBefore(dueDate, addDays(now, 7))) {
                toast.info(`Weekly Reminder: "${todo.title}" is due ${format(dueDate, 'PPp')}`);
              }
              break;
            case 'custom':
              if (todo.notificationSettings.customTime) {
                const notificationTime = addMinutes(dueDate, -todo.notificationSettings.customTime);
                if (isAfter(now, notificationTime) && isBefore(now, dueDate)) {
                  toast.info(`Reminder: "${todo.title}" is due in ${todo.notificationSettings.customTime} minutes`);
                }
              }
              break;
          }
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(notificationInterval);
  }, [state.todos]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newTodo: Todo = {
      id: editingTodo?.id || Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      dueDate: new Date(formData.get('dueDate') as string),
      completed: editingTodo?.completed || false,
      notificationSettings: {
        enabled: formData.get('notification') === 'on',
        type: formData.get('notificationType') as 'daily' | 'weekly' | 'custom',
        customTime: formData.get('customTime') ? Number(formData.get('customTime')) : undefined
      }
    };

    if (editingTodo) {
      setState(prev => ({
        ...prev,
        todos: prev.todos.map(todo => 
          todo.id === editingTodo.id ? newTodo : todo
        )
      }));
      setEditingTodo(null);
      toast.success('Todo updated successfully!');
    } else {
      setState(prev => ({
        ...prev,
        todos: [...prev.todos, newTodo]
      }));
      toast.success('Todo added successfully!');
    }

    form.reset();
  };

  const handleDelete = (id: string) => {
    setTodoToDelete(id);
  };

  const confirmDelete = () => {
    if (todoToDelete) {
      setState(prev => ({
        ...prev,
        todos: prev.todos.filter(todo => todo.id !== todoToDelete)
      }));
      toast.success('Todo deleted successfully!');
      setTodoToDelete(null);
    }
  };

  const cancelDelete = () => {
    setTodoToDelete(null);
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    // Populate the form with todo data
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) {
      const titleInput = form.querySelector('input[name="title"]') as HTMLInputElement;
      const descriptionInput = form.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
      const dueDateInput = form.querySelector('input[name="dueDate"]') as HTMLInputElement;
      const notificationInput = form.querySelector('input[name="notification"]') as HTMLInputElement;
      const notificationTypeInput = form.querySelector('select[name="notificationType"]') as HTMLSelectElement;
      const customTimeInput = form.querySelector('input[name="customTime"]') as HTMLInputElement;

      if (titleInput && descriptionInput && dueDateInput && notificationInput && notificationTypeInput) {
        titleInput.value = todo.title;
        descriptionInput.value = todo.description;
        dueDateInput.value = format(new Date(todo.dueDate), "yyyy-MM-dd'T'HH:mm");
        notificationInput.checked = todo.notificationSettings.enabled;
        notificationTypeInput.value = todo.notificationSettings.type;
        
        if (customTimeInput && todo.notificationSettings.customTime) {
          customTimeInput.value = todo.notificationSettings.customTime.toString();
        }
      }
    }
  };

  const handleToggleComplete = (id: string) => {
    setState(prev => ({
      ...prev,
      todos: prev.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    }));
    toast.success('Todo status updated!');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
      ...prev,
      searchQuery: e.target.value,
      currentPage: 1
    }));
  };

  const filteredTodos = state.todos.filter(todo =>
    todo.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
    todo.description.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTodos.length / state.itemsPerPage);
  const currentTodos = filteredTodos.slice(
    (state.currentPage - 1) * state.itemsPerPage,
    state.currentPage * state.itemsPerPage
  );

  return (
    <MainContainer>
      <AppContainer>
        <Header>
          <Title>TaskMaster Pro</Title>
        </Header>

        <TodoForm onSubmit={handleAddTodo}>
          <Input
            type="text"
            name="title"
            placeholder="Task Title"
            required
          />
          <TextArea
            name="description"
            placeholder="Task Description"
            required
          />
          <DateTimeInput
            type="datetime-local"
            name="dueDate"
            required
            onClick={(e) => (e.target as HTMLInputElement).showPicker()}
          />
          <NotificationSettings>
            <label>
              <input type="checkbox" name="notification" />
              Enable Notification
            </label>
            <select name="notificationType">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </select>
            <Input
              type="number"
              name="customTime"
              placeholder="Minutes before due date"
              min="1"
            />
          </NotificationSettings>
          <FormActions>
            {editingTodo && (
              <Button type="button" variant="danger" onClick={() => setEditingTodo(null)}>
                Cancel
              </Button>
            )}
            <Button type="submit">
              {editingTodo ? 'Update' : 'Add Task'}
            </Button>
          </FormActions>
        </TodoForm>

        <Input
          type="text"
          placeholder="Search tasks..."
          value={state.searchQuery}
          onChange={handleSearch}
          style={{ marginBottom: '1rem' }}
        />

        <TodoList>
          {currentTodos.map(todo => (
            <TodoItem key={todo.id} completed={todo.completed}>
              <TodoContent>
                <h3 style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                  {todo.title}
                </h3>
                <p>{todo.description}</p>
                <p>Due: {format(new Date(todo.dueDate), 'PPp')}</p>
                {todo.notificationSettings.enabled && (
                  <p>
                    <FaBell /> Notification: {todo.notificationSettings.type}
                    {todo.notificationSettings.customTime && 
                      ` (${todo.notificationSettings.customTime} minutes before)`
                    }
                  </p>
                )}
              </TodoContent>
              <TodoActions>
                <IconButton
                  onClick={() => handleToggleComplete(todo.id)}
                  color={todo.completed ? '#e74c3c' : '#2ecc71'}
                  title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {todo.completed ? <FaTimes /> : <FaCheck />}
                </IconButton>
                <IconButton
                  onClick={() => handleEdit(todo)}
                  color="#f1c40f"
                  title="Edit task"
                >
                  <FaEdit />
                </IconButton>
                <IconButton
                  onClick={() => handleDelete(todo.id)}
                  color="#e74c3c"
                  title="Delete task"
                >
                  <FaTrash />
                </IconButton>
              </TodoActions>
            </TodoItem>
          ))}
        </TodoList>

        {totalPages > 1 && (
          <Pagination>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                onClick={() => setState(prev => ({ ...prev, currentPage: i + 1 }))}
                style={{
                  backgroundColor: state.currentPage === i + 1 ? '#2c3e50' : '#3498db'
                }}
              >
                {i + 1}
              </Button>
            ))}
          </Pagination>
        )}

        {todoToDelete && (
          <>
            <ConfirmOverlay />
            <ConfirmDialog>
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this task?</p>
              <ButtonGroup>
                <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                <Button onClick={cancelDelete}>Cancel</Button>
              </ButtonGroup>
            </ConfirmDialog>
          </>
        )}

        <ToastContainer 
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AppContainer>
    </MainContainer>
  );
};

export default App; 