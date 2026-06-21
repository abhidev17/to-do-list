import { useMemo, useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [removingTaskIds, setRemovingTaskIds] = useState([]);

  const taskCounts = useMemo(() => {
    const completedTasks = tasks.filter((currentTask) => currentTask.completed);

    return {
      total: tasks.length,
      completed: completedTasks.length,
      pending: tasks.length - completedTasks.length,
    };
  }, [tasks]);

  const addTask = (event) => {
    event.preventDefault();

    const nextTask = task.trim();

    if (nextTask === "") return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: nextTask,
        completed: false,
      },
    ]);

    setTask("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setRemovingTaskIds((currentIds) =>
      currentIds.includes(id) ? currentIds : [...currentIds, id]
    );

    window.setTimeout(() => {
      setTasks((currentTasks) =>
        currentTasks.filter((currentTask) => currentTask.id !== id)
      );

      setRemovingTaskIds((currentIds) =>
        currentIds.filter((currentId) => currentId !== id)
      );
    }, 220);
  };

  return (
    <main className="app-shell">
      <section className="todo-card">
        <div className="hero">
          <div className="eyebrow">Productivity board</div>
          <h1>To-Do List</h1>
          <p>Plan your day, complete tasks, and keep momentum with a clean, colorful workflow.</p>
        </div>

        <form className="input-section" onSubmit={addTask}>
          <label className="sr-only" htmlFor="task-input">
            Enter a task
          </label>
          <input
            id="task-input"
            type="text"
            placeholder="Enter a task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

          <button className="primary-button" type="submit">
            Add Task
          </button>
        </form>

        <div className="stats-grid" aria-label="Task counters">
          <div className="stat-card stat-card--total">
            <span>Total Tasks</span>
            <strong>{taskCounts.total}</strong>
          </div>
          <div className="stat-card stat-card--completed">
            <span>Completed Tasks</span>
            <strong>{taskCounts.completed}</strong>
          </div>
          <div className="stat-card stat-card--pending">
            <span>Pending Tasks</span>
            <strong>{taskCounts.pending}</strong>
          </div>
        </div>

        <ul className="task-list">
          {tasks.map((currentTask) => {
            const isCompleted = currentTask.completed;
            const isDeleting = removingTaskIds.includes(currentTask.id);

            return (
              <li
                key={currentTask.id}
                className={`task-item ${isCompleted ? "task-item--completed" : "task-item--pending"} ${isDeleting ? "task-item--deleting" : ""}`}
              >
                <div className="task-copy">
                  <span className={`status-badge ${isCompleted ? "status-badge--completed" : "status-badge--pending"}`}>
                    {isCompleted ? "✓" : "•"}
                  </span>

                  <div className="task-text-wrap">
                    <span className="task-state-label">
                      {isCompleted ? "Completed" : "Pending"}
                    </span>
                    <span className={`task-text ${isCompleted ? "task-text--completed" : ""}`}>
                      {currentTask.text}
                    </span>
                  </div>
                </div>

                <div className="task-actions">
                  <button
                    className="task-button task-button--complete"
                    onClick={() => toggleTask(currentTask.id)}
                    type="button"
                  >
                    {isCompleted ? "Completed" : "Complete"}
                  </button>

                  <button
                    className="task-button task-button--delete"
                    onClick={() => deleteTask(currentTask.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}

export default App;