# Blog Content Management System (CMS)

## Overview
In today's digital age, the significance of effective content management systems cannot be overstated. With the exponential growth of online content, the need for organized, user-friendly platforms to create, manage, and consume information is paramount. Our project aims to address this need through the development of a comprehensive content management system tailored specifically for blogs.

## Features
- **User-friendly Interface**: Streamlined process for creating, publishing, and categorizing blog posts.
- **Engagement Tools**: Comments and likes to foster community interaction.
- **Collaborative Functionality**: Support for multiple users, enabling collaborative content creation and management.
- **Email Notifications**: Keeps users informed and engaged with updates to their content.

## Benefits
- **Enhanced Navigation and Accessibility**: For both content creators and readers.
- **Community Building**: Empowers users to engage with content and each other.
- **Productivity Boost**: Collaborative features that enhance productivity and teamwork.
- **Active Participation**: Promotes active discussion and participation through email notifications.

## Technology Stack
### Front End
- ReactJS
- SCSS Preprocessor

### Back End
- NodeJS
- ExpressJS
- MySQL

## System Requirements
### Software Requirements
- **Operating System**: Windows 7/8/10, Linux, Mac OS X

### Hardware Requirements
- **Processor**: x86 compatible processor with 1.7 GHz Clock Speed
- **RAM**: 1024 MB or greater
- **Hard Disk**: 20 GB or greater
- **Monitor**: VGA/SVGA
- **Keyboard**: 104 keys standard
- **Mouse**: 2/3 button, Optical/Mechanical

## Installation and Setup
### Prerequisites
- Node.js installed on your machine.
- MySQL server setup.

### Steps
1. **Clone the Repository**
    ```bash
    git clone [https://github.com/ashwinikrishnajirao/Content_Management.git]
    cd blog-cms
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **Set Up MySQL Database**
    - Create a database named `blog_cms`.
    - Import the database schema from `schema.sql` (if provided).

4. **Configure Environment Variables**
    - Create a `.env` file in the root directory.
    - Add the following environment variables:
      ```plaintext
      DB_HOST=localhost
      DB_USER=root
      DB_PASS=yourpassword
      DB_NAME=blog_cms
      ```

5. **Run the Application**
    ```bash
    npm start
    ```

6. **Access the Application**
    - Open your browser and navigate to `http://localhost:3000`.

## Usage
- **Create Posts**: Navigate to the "Create Post" section to add new blog entries.
- **Manage Posts**: Edit or delete existing posts from the "Manage Posts" section.
- **User Interaction**: Engage with the content through comments and likes.

## Contribution
We welcome contributions to enhance the functionality and features of this CMS. Please fork the repository and create a pull request with your changes.




This README provides a comprehensive overview of the Blog Content Management System, detailing its features, technology stack, system requirements, and installation instructions. The goal is to offer a user-friendly, collaborative, and engaging platform for content creators and consumers alike.
