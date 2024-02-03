CREATE DATABASE Evently ;

CREATE TABLE panel(
    user_id SERIAL PRIMARY KEY ,
    Firstname VARCHAR (300) ,
    LastName VARCHAR (300) ,
    Email VARCHAR(500),
    password VARCHAR(400),
    available_start_time TIME,
    available_end_time TIME,
    meeting_durations INT[] ,
    available_days TEXT[]
);

CREATE TABLE events(
    user_id SERIAL PRIMARY KEY,
    Email VARCHAR,
    link VARCHAR, 
    time_start VARCHAR, 
    time_end VARCHAR, 
    event_name VARCHAR, 
    days_selected TEXT[],
    duration INT
);

CREATE TABLE bookmeet(
    user_id SERIAL PRIMARY KEY,
    link VARCHAR ,
    host VARCHAR ,
    users VARCHAR ,
    video_chat VARCHAR ,
    date VARCHAR , 
    time VARCHAR
);


