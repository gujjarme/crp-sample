DO $$
DECLARE
    db_exists INTEGER;
BEGIN
    -- Check if the database 'mydb' exists
    SELECT COUNT(*) INTO db_exists FROM pg_database WHERE datname = 'mydb';

    -- If the database 'mydb' doesn't exist, create it
    IF db_exists = 0 THEN
        CREATE DATABASE mydb;
    END IF;
END $$;

-- Connect to the 'mydb' database
\c mydb;

-- Create the 'userinfoo' schema if it doesn't exist

-- Create the 'userinfoo' table in the 'mydb' schema

CREATE TABLE UserRoles (
    roleid SERIAL PRIMARY KEY,
    rolename VARCHAR(50) NOT NULL
);

CREATE TABLE project (
    projectid SERIAL PRIMARY KEY,
    projectname VARCHAR(100) NOT NULL,
    description TEXT,
    startdate DATE,
    enddate DATE
);

CREATE TABLE users (
    userId VARCHAR(50) PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role_id INT REFERENCES UserRoles(roleid),
    creationdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastupdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE filters (
    filterid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    ownerid VARCHAR(50) REFERENCES users(userId),
    criteria JSON
);



CREATE TABLE stakeholders (
    stakeholder_id SERIAL PRIMARY KEY,
    userid VARCHAR(50) REFERENCES users(userId),
    projectid INT REFERENCES project(projectid)
);





CREATE TABLE testrun (
    testrunid SERIAL PRIMARY KEY,
    testname VARCHAR(100) NOT NULL,
    projectid INT REFERENCES project(projectid),
    starttime TIMESTAMP,
    endtime TIMESTAMP,
    description TEXT,
    status VARCHAR(20),
    passedtests INT,
    totaltests INT,
    failedtests INT,
    receivedat TIMESTAMP
);

CREATE TABLE dashboard (
    dashboardid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    ownerid VARCHAR(50) REFERENCES users(userId),
    projectid INT REFERENCES project(projectid),
    lastmodified DATE NOT NULL
);
CREATE TABLE UserLevelDashboards (
    userleveldashboardid SERIAL PRIMARY KEY,
    dashboardId INT REFERENCES dashboard(dashboardid),
    roleid INT REFERENCES UserRoles(roleid)
);


CREATE TABLE widgettype (
    widgettypeid SERIAL PRIMARY KEY,
    typename VARCHAR(100) NOT NULL
);

CREATE TABLE widgets (
    widgetid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    ownerid VARCHAR(50) REFERENCES users(userId),
    typeid INT REFERENCES widgettype(widgettypeid),
    configurations JSON,
    lastmodified TIMESTAMP
   
);

CREATE TABLE DashboardWidget (
    dashboardwidgetid SERIAL PRIMARY KEY,
    dashboardid INT REFERENCES Dashboard(dashboardid),
    widgetid INT REFERENCES Widgets(widgetid)
    -- Add other columns specific to the relationship between dashboards and widgets
);
CREATE TABLE WidgetFilter (
    id SERIAL PRIMARY KEY,
    widgetid INT REFERENCES Widgets(widgetid),
    filterid INT REFERENCES Filters(filterid)
    -- Add other columns specific to the relationship between widgets and filters
);

-- Display a message indicating success

