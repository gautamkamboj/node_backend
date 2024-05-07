const fs = require('fs');
const path = require('path');
const readline = require('readline');

const tasksFilePath = path.join(__dirname, 'tasks.txt');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Add a new task
function addTask(task) {
    fs.appendFileSync(tasksFilePath, task + '\n');
    console.log('Task added successfully.');
}

// View a list of tasks
function viewTasks() {
    const tasks = fs.readFileSync(tasksFilePath, 'utf8').split('\n').filter(task => task.trim() !== '');
    if (tasks.length === 0) {
        console.log('No tasks available.');
    } else {
        console.log('List of tasks:');
        tasks.forEach((task, index) => console.log(`${index + 1}. ${task}`));
    }
}

// Mark a task as complete
function markTaskComplete(index) {
    let tasks = fs.readFileSync(tasksFilePath, 'utf8').split('\n');
    if (index >= 1 && index <= tasks.length) {
        tasks[index - 1] = '✔ Task completed- ' + tasks[index - 1];
        fs.writeFileSync(tasksFilePath, tasks.join('\n'));
        console.log('Task marked as complete.');
    } else {
        console.log('Invalid task index.');
    }
}

// Remove a task
function removeTask(index) {
    let tasks = fs.readFileSync(tasksFilePath, 'utf8').split('\n');
    if (index >= 1 && index <= tasks.length) {
        tasks.splice(index - 1, 1);
        fs.writeFileSync(tasksFilePath, tasks.join('\n'));
        console.log('Task removed successfully.');
    } else {
        console.log('Invalid task index.');
    }
}

// Menu
function menu() {
    console.log('1. Add a new task');
    console.log('2. View list of tasks');
    console.log('3. Mark a task as complete');
    console.log('4. Remove a task');
    console.log('5. Exit');
}

// Main function
function main() {
    menu();
    rl.question('Enter your choice: ', (choice) => {
        switch (choice) {
            case '1':
                rl.question('Enter new task: ', (task) => {
                    addTask(task);
                    main();
                });
                break;
            case '2':
                viewTasks();
                main();
                break;
            case '3':
                rl.question('Enter task index to mark as complete: ', (index) => {
                    markTaskComplete(parseInt(index));
                    main();
                });
                break;
            case '4':
                rl.question('Enter task index to remove: ', (index) => {
                    removeTask(parseInt(index));
                    main();
                });
                break;
            case '5':
                rl.close();
                break;
            default:
                console.log('Invalid choice. Please try again.');
                main();
                break;
        }
    });
}

// Start the program
main();
