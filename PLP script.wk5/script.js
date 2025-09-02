// Variable declarations - storing our task data
        let tasks = []; // Array to store all tasks
        let taskIdCounter = 1; // Counter for unique task IDs
        const maxTasksPerPriority = 10; // Constant for maximum tasks per priority
        let currentFilter = 'all'; // Current filter state

        // Example of different variable types
        let userName = 'User'; // String variable
        let isTaskFormVisible = true; // Boolean variable
        let completionRate = 0; // Number variable

         /**
         * Function 1: Add a new task to the list
         * Demonstrates conditionals and DOM manipulation
         */
        function addTask() {
            // Get input values
            const taskInput = document.getElementById('taskInput');
            const prioritySelect = document.getElementById('prioritySelect');
            
            const taskText = taskInput.value.trim();
            const priority = prioritySelect.value;

            // Conditional: Check if task text is empty
            if (taskText === '') {
                alert('Please enter a task description!');
                return;
            }

            // Conditional: Check task length
            if (taskText.length < 3) {
                alert('Task description must be at least 3 characters long!');
                return;
            }

            // Conditional: Check if we have too many high priority tasks
            const highPriorityCount = tasks.filter(task => task.priority === 'high' && !task.completed).length;
            if (priority === 'high' && highPriorityCount >= maxTasksPerPriority) {
                alert(`You can only have ${maxTasksPerPriority} high priority tasks at once!`);
                return;
            }

            // Create new task object
            const newTask = {
                id: taskIdCounter++,
                text: taskText,
                priority: priority,
                completed: false,
                createdAt: new Date().toLocaleString()
            };

            // Add task to array
            tasks.push(newTask);

            // Clear input and reset priority
            taskInput.value = '';
            prioritySelect.value = 'medium';

            // Update display
            displayTasks();
            updateStatistics();

            // Provide user feedback based on priority
            if (priority === 'high') {
                console.log('High priority task added! Don\'t forget to complete it soon.');
            }
        }

        /**
         * Function 2: Calculate and display task statistics
         * Demonstrates mathematical operations and conditionals
         */
        function updateStatistics() {
            const totalCount = tasks.length;
            let completedCount = 0;
            let pendingCount = 0;

            // Count completed and pending tasks
            tasks.forEach(task => {
                if (task.completed) {
                    completedCount++;
                } else {
                    pendingCount++;
                }
            });

            // Calculate completion rate
            completionRate = totalCount > 0 ? (completedCount / totalCount * 100).toFixed(1) : 0;

            // Update DOM elements with statistics
            document.getElementById('totalTasks').textContent = totalCount;
            document.getElementById('completedTasks').textContent = completedCount;
            document.getElementById('pendingTasks').textContent = pendingCount;

            // Conditional feedback based on completion rate
            if (completionRate >= 80 && totalCount > 0) {
                console.log(`Great job! You've completed ${completionRate}% of your tasks!`);
            } else if (completionRate < 50 && totalCount > 3) {
                console.log('You have many pending tasks. Consider prioritizing them!');
            }
        }

        // ===========================================
        // PART 3: LOOPS
        // ===========================================

        /**
         * Loop Example 1: For loop to display all tasks
         * Demonstrates traditional for loop with DOM manipulation
         */
        function displayTasks() {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = ''; // Clear current display

            // Filter tasks based on current filter
            const filteredTasks = getFilteredTasks();

            // For loop to create HTML for each task
            for (let i = 0; i < filteredTasks.length; i++) {
                const task = filteredTasks[i];
                
                // Create task element HTML
                const taskElement = document.createElement('div');
                taskElement.className = `task-item ${task.completed ? 'completed' : ''} ${task.priority}`;
                taskElement.innerHTML = `
                    <div>
                        <strong>${task.text}</strong>
                        <div style="font-size: 12px; color: #666;">
                            Priority: ${task.priority.toUpperCase()} | Created: ${task.createdAt}
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="btn-small btn-complete" onclick="toggleTask(${task.id})">
                            ${task.completed ? 'Undo' : 'Complete'}
                        </button>
                        <button class="btn-small btn-delete" onclick="deleteTask(${task.id})">
                            Delete
                        </button>
                    </div>
                `;
                
                taskList.appendChild(taskElement);
            }

            // Display message if no tasks match filter
            if (filteredTasks.length === 0) {
                taskList.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No tasks to display</p>';
            }
        }

        /**
         * Loop Example 2: While loop to find overdue high-priority tasks
         * Demonstrates while loop with conditional logic
         */
        function findOverdueTasks() {
            let overdueCount = 0;
            let i = 0;

            // While loop to check each task
            while (i < tasks.length) {
                const task = tasks[i];
                
                // Check if task is high priority and not completed
                if (task.priority === 'high' && !task.completed) {
                    const taskAge = Date.now() - new Date(task.createdAt).getTime();
                    const daysSinceCreated = taskAge / (1000 * 60 * 60 * 24);
                    
                    // Consider high-priority tasks overdue after 2 days
                    if (daysSinceCreated > 2) {
                        overdueCount++;
                        console.log(`Overdue high-priority task found: ${task.text}`);
                    }
                }
                i++;
            }

            return overdueCount;
        }

        // ===========================================
        // PART 4: DOM INTERACTIONS
        // ===========================================

        /**
         * DOM Interaction 1: Toggle task completion status
         * Demonstrates finding elements by ID and updating classes
         */
        function toggleTask(taskId) {
            // Find the task in our array
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            
            if (taskIndex !== -1) {
                // Toggle completed status
                tasks[taskIndex].completed = !tasks[taskIndex].completed;
                
                // Update the display
                displayTasks();
                updateStatistics();
                
                // Provide user feedback
                const task = tasks[taskIndex];
                if (task.completed) {
                    console.log(`Task completed: ${task.text}`);
                } else {
                    console.log(`Task marked as pending: ${task.text}`);
                }
            }
        }

        /**
         * DOM Interaction 2: Delete a task from the list
         * Demonstrates array manipulation and DOM updates
         */
        function deleteTask(taskId) {
            // Confirm deletion
            const task = tasks.find(task => task.id === taskId);
            if (task && confirm(`Are you sure you want to delete "${task.text}"?`)) {
                // Remove task from array
                tasks = tasks.filter(task => task.id !== taskId);
                
                // Update display
                displayTasks();
                updateStatistics();
                
                console.log(`Task deleted: ${task.text}`);
            }
        }

        /**
         * DOM Interaction 3: Filter tasks based on status/priority
         * Demonstrates event handling and dynamic content filtering
         */
        function filterTasks(filter) {
            currentFilter = filter;
            
            // Update active filter button
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            // Update task display
            displayTasks();
            
            console.log(`Filter applied: ${filter}`);
        }

        /**
         * Helper function to get filtered tasks
         */
        function getFilteredTasks() {
            switch (currentFilter) {
                case 'completed':
                    return tasks.filter(task => task.completed);
                case 'pending':
                    return tasks.filter(task => !task.completed);
                case 'high':
                    return tasks.filter(task => task.priority === 'high');
                default:
                    return tasks; // 'all' filter
            }
        }

        /**
         * Additional DOM Interaction: Clear all tasks
         * Demonstrates confirmation dialogs and bulk operations
         */
        function clearAllTasks() {
            if (tasks.length === 0) {
                alert('No tasks to clear!');
                return;
            }
            
            if (confirm(`Are you sure you want to delete all ${tasks.length} tasks?`)) {
                tasks = [];
                taskIdCounter = 1;
                displayTasks();
                updateStatistics();
                console.log('All tasks cleared!');
            }
        }

        // ===========================================
        // INITIALIZATION AND EVENT LISTENERS
        // ===========================================

        // Initialize the application when page loads
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Task Manager initialized!');
            
            // Add some sample tasks for demonstration
            tasks = [
                {
                    id: taskIdCounter++,
                    text: 'Learn JavaScript fundamentals',
                    priority: 'high',
                    completed: true,
                    createdAt: new Date().toLocaleString()
                },
                {
                    id: taskIdCounter++,
                    text: 'Practice DOM manipulation',
                    priority: 'medium',
                    completed: false,
                    createdAt: new Date().toLocaleString()
                },
                {
                    id: taskIdCounter++,
                    text: 'Build a web application',
                    priority: 'low',
                    completed: false,
                    createdAt: new Date().toLocaleString()
                }
            ];
            
            // Initial display update
            displayTasks();
            updateStatistics();
            
            // Add Enter key listener for task input
            const taskInput = document.getElementById('taskInput');
            taskInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    addTask();
                }
            });
            
            // Check for overdue tasks on startup
            setTimeout(() => {
                const overdueCount = findOverdueTasks();
                if (overdueCount > 0) {
                    console.log(`You have ${overdueCount} overdue high-priority task(s)!`);
                }
            }, 1000);
        });

        // ===========================================
        // ADDITIONAL DEMONSTRATION FUNCTIONS
        // ===========================================

        /**
         * Bonus: Advanced loop example using forEach
         * Demonstrates modern JavaScript iteration methods
         */
        function analyzeTasks() {
            let analysis = {
                high: 0,
                medium: 0,
                low: 0,
                completed: 0
            };

            // forEach loop to analyze tasks
            tasks.forEach(function(task) {
                // Count by priority
                analysis[task.priority]++;
                
                // Count completed tasks
                if (task.completed) {
                    analysis.completed++;
                }
            });

            console.log('Task Analysis:', analysis);
            return analysis;
        }

        /**
         * Bonus: Conditional styling based on task count
         * Demonstrates dynamic CSS manipulation
         */
        function updateTaskListStyling() {
            const taskListElement = document.getElementById('taskList');
            const taskCount = tasks.length;

            // Conditional styling based on number of tasks
            if (taskCount === 0) {
                taskListElement.style.backgroundColor = '#f8f9fa';
                taskListElement.style.borderStyle = 'dashed';
            } else if (taskCount > 10) {
                taskListElement.style.backgroundColor = '#fff3cd';
                taskListElement.style.border = '2px solid #ffc107';
            } else {
                taskListElement.style.backgroundColor = 'transparent';
                taskListElement.style.border = 'none';
            }
        }