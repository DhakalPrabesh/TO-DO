export interface Todo {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  notificationSettings: {
    enabled: boolean;
    type: 'daily' | 'weekly' | 'custom';
    customTime?: number; // minutes before due date
  };
}

export interface TodoState {
  todos: Todo[];
  currentPage: number;
  itemsPerPage: number;
  searchQuery: string;
} 