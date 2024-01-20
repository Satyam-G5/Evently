CREATE DATABASE Evently ;

CREATE TABLE panel(
    user_id SERIAL PRIMARY KEY ,
    Firstname VARCHAR (300) ,
    LastName VARCHAR (300) ,
    meeting_datetime TIMESTAMP,
    Email VARCHAR(500),
    password VARCHAR(400)
);

CREATE TABLE events(
    user_id SERIAL PRIMARY KEY ,
    Email VARCHAR(500),
    date DATE ,
    time TIME ,
    event_name VARCHAR ,
    duration INT 
);

