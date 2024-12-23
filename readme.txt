Project Overview:
-This project involves developing Two (2) Django REST Framework (DRF) applications that communicate securely using encrypted or hashed messages. The focus is on building secure APIs with middleware for encryption/decryption and integrating essential features to ensure robust and secure communication.

Features:
-	Login and Registration
User authentication is implemented in both applications to ensure secure access.

-	Secure Message Transmission
APIs for sending and receiving messages are developed.
Messages are encrypted or hashed before transmission and decrypted upon reception.

-	Security Middleware
Custom middleware handles encryption, hashing, and request validation for enhanced security.

-	Dashboard
An intuitive interface displays and manages all users and messages.

Requirements:
To set up and run the applications, follow these steps:
1.	Clone the Repository
git clone <repository-url>  
cd <repository-folder>  

2.	Set Up the Backend
Navigate to the backend folder and execute the following commands:
cd backend  
python -m venv venv  
pip install -r requirements.txt  
python manage.py migrate  
python manage.py runserver  

3.	Test Accounts for Login
Use the following test accounts for authentication and testing:
o	Account 1
Email: test@gmail.com
Password: test123/.
o	Account 2
Email: test2@gmail.com
Password: Sample123/.

