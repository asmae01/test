import React, { useState } from 'react';

// Utility function for assigning tasks
function assignTasks(developers, tasks) {
    tasks.sort((a, b) => b.priority - a.priority); // Sort tasks by priority
    const unassignedTasks = [];
    const completedTasks = new Set(); // Track completed tasks for dependency checks

    developers.forEach(dev => {
        dev.assignedTasks = [];
        dev.totalHours = 0;
    });

    tasks.forEach(task => {
        let assigned = false;
        
        developers.some(dev => {
            // Check if developer meets task requirements
            if (
                task.difficulty <= dev.skillLevel &&
                dev.totalHours + task.hoursRequired <= dev.maxHours &&
                task.dependencies.every(dep => completedTasks.has(dep))
            ) {
                // Assign task
                dev.assignedTasks.push(task);
                dev.totalHours += task.hoursRequired;
                completedTasks.add(task.taskName);
                assigned = true;
                return true; // Stop loop once assigned
            }
        });

        if (!assigned) unassignedTasks.push(task);
    });

    return { developers, unassignedTasks };
}

function App() {
    const [results, setResults] = useState(null);

    const developers = [
        { name: 'Alice', skillLevel: 7, maxHours: 40 },
        { name: 'Bob', skillLevel: 9, maxHours: 30 },
        { name: 'Charlie', skillLevel: 5, maxHours: 35 }
    ];

    const tasks = [
        { taskName: 'Feature A', difficulty: 7, hoursRequired: 15, priority: 4, dependencies: [] },
        { taskName: 'Bug Fix B', difficulty: 5, hoursRequired: 10, priority: 5, dependencies: [] },
        { taskName: 'Refactor C', difficulty: 9, hoursRequired: 25, priority: 3, dependencies: ['Bug Fix B'] },
        { taskName: 'Optimization D', difficulty: 6, hoursRequired: 20, priority: 2, dependencies: [] },
        { taskName: 'Upgrade E', difficulty: 8, hoursRequired: 15, priority: 5, dependencies: ['Feature A'] }
    ];

    const handleAssignTasks = () => {
        const result = assignTasks(developers, tasks);
        setResults(result);
    };

    return (
        <div>
            <h1>Task Scheduler</h1>
            <button onClick={handleAssignTasks}>Assign Tasks</button>

            {results && (
                <div>
                    <h2>Developers with Assigned Tasks</h2>
                    {results.developers.map(dev => (
                        <div key={dev.name}>
                            <h3>{dev.name} (Total Hours: {dev.totalHours})</h3>
                            <ul>
                                {dev.assignedTasks.map(task => (
                                    <li key={task.taskName}>{task.taskName}</li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <h2>Unassigned Tasks</h2>
                    <ul>
                        {results.unassignedTasks.map(task => (
                            <li key={task.taskName}>{task.taskName}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default App;


// export default App;
