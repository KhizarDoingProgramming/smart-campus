CREATE DATABASE IF NOT EXISTS smart_campus;
USE smart_campus;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    dept VARCHAR(100) NOT NULL,
    rollNo VARCHAR(50) NOT NULL UNIQUE,
    bio TEXT,
    joinDate DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    date VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    seats INT NOT NULL,
    color VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS societies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    members INT NOT NULL,
    description TEXT,
    icon VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    event_id INT,
    rating INT,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (name, email, password, dept, rollNo, bio, joinDate) VALUES 
('Ali Hassan', 'ali@campus.edu', 'ali123', 'Computer Science', 'CS-2021-01', '', CURDATE()),
('Sara Khan', 'sara@campus.edu', 'sara123', 'Software Engineering', 'SE-2021-02', '', CURDATE());

INSERT INTO events (title, category, date, location, seats, color) VALUES 
('Tech Fest 2025', 'Technology', 'May 10, 2025', 'Main Auditorium', 50, '#6C63FF'),
('Art Expo', 'Creative', 'May 12, 2025', 'Student Center', 30, '#FF6B6B'),
('Startup Pitch', 'Business', 'May 15, 2025', 'Business School', 20, '#43E97B');
