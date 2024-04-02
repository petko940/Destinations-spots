# Destinations-spots

Discover new destinations created by fellow travelers with Destinations Spots: Your Hub for sharing nice spots.

## Technologies Used

- **Frontend**

![My Skills](https://skillicons.dev/icons?i=ts,angular,html,css,tailwind,vscode)

- **Backend**

![My Skills](https://skillicons.dev/icons?i=py,django,pycharm,postgres,docker)

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
    - [Home](#home)
    - [Search](#search)
    - [About](#about)
    - [All Destinations](#all-destinations)
    - [Destination Details](#destination-details)
    - [Create Destination](#create-destination)
    - [Authentication](#authentication)
    - [Profile](#profile)
3. [Installation](#installation)
4. [Screenshots](#screenshots)


## Introduction

Welcome to Destinations Spots, a platform designed for travelers to discover new destinations, share their experiences, and connect with like-minded adventurers. Whether you're seeking inspiration or ready to share your latest adventure, Destinations Spots is your gateway to exploring the world.

## Features


Welcome to Destinations Spots, a platform designed for travelers to discover new destinations, share their experiences, and connect with like-minded adventurers. Whether you're seeking inspiration or ready to share your latest adventure, Destinations Spots is your gateway to exploring the world.


## Features


#### Home

 - The home page displays the highest-rated destinations and the most recent destinations created.


#### Search

 - Search enables users to find destinations by name, description, location, or username.


#### About

 - Discover more about Destinations Spots and its mission to inspire and facilitate travel exploration.


#### All Destinations

 - Explore a list of destinations with convenient pagination, showcasing four destinations per page. 
 - Logged-in users have access to view only the destinations they've created.


#### Destination Details

 - Explore detailed information about each destination:
    - **Name:** The name of the destination.
    - **Description:** A description of the destination's highlights and features.
    - **Image:** If available, click to view the image bigger.
    - **Location:** The name of the marked location on the map.
    - **Made By:** The username of the user who created the destination. Clicking on it will lead to the user's profile.
    - **Last Modified:** The date and time when the destination was last modified.
    - **Map:** Interactive map displaying the location of the destination.
    - **Rating:** Logged-in users can rate the destination from 1 to 5 stars.
    - **Comments:** Users can leave comments to share their thoughts and experiences about the destination.
    - **Actions:** If the destination is created by the logged-in user, editing and deleting options are shown.


#### Create Destination

 - Logged-in users can create new destinations by providing names, descriptions, uploading photos, and specifying locations on the map. 
 - This feature enables users to share their travel experiences with the community.


#### Edit Destination

 - Modify the details of the destination:
    - **Input Fields:** Editing allows users to update the destination's name, description, image, and location.
    - **Pre-filled Data:** Input fields are pre-filled with the current data, making it easier to make modifications.


#### Authentication

 - Register, login, and logout to access personalized features and create content.


#### Profile

 - View and manage your profile information:
    - **Destinations Created:** See the number of destinations you've created and their names.
    - **Edit Username:** If logged in, you can edit your username.
    - **Rating History:** Logged-in users can view how many times you've rated different destinations.


## Installation

To run Destinations Spots locally, follow these steps:


#### Prerequisites

Ensure you have the following software installed on your machine:

 - Docker
 - Python
 - Node.js (for Angular)


#### Running Locally

 - Navigate to backend directory 
```cd .\backend```

 - Run 
```docker-compose up --build```

 - Open new terminal and navigate to frontend 
```cd .\frontend```

 - Install all dependecies
```npm i```

 - Run Angular application
 ```ng serve```


## Screenshots

- **Home**
![Alt text](/screenshots/home.png)

- **Search**
![Alt text](/screenshots/search.png)

- **About**
![Alt text](/screenshots/about.png)

- **All Destinations**
![Alt text](/screenshots/all-destinations.png)

- **Destination Details Current Logged User**
![Alt text](/screenshots/detail-destionation-current-user-can-edit-delete.png)

- **Destination Details Other User/Not logged**
![Alt text](/screenshots/detail-destionation-other-user.png)

- **Create Destination**
![Alt text](/screenshots/create-destination.png)

- **Edit Destination**
![Alt text](/screenshots/edit-destionation.png)

- **Delete Destination**
![Alt text](/screenshots/delete-destination.png)

- **Profile with current user**
![Alt text](/screenshots/profile-current-user.png)

- **Profile with Other User/Not logged**
![Alt text](/screenshots/profile-not-logged.png)

- **Login with error**
![Alt text](/screenshots/login.png)

- **Register with errors**
![Alt text](/screenshots/register-with-errors.png)
