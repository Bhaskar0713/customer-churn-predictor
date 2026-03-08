# Customer Churn Prediction System

A full-stack Machine Learning web application that predicts whether a telecom customer is likely to churn or continue using a service. The system uses customer service and billing features to generate predictions and displays results through an interactive analytics dashboard.

## Features

* Machine Learning–based churn prediction
* Admin login authentication
* Interactive dashboard with analytics
* Prediction history storage using SQLite
* Bar chart and pie chart visualizations
* Decision tree visualization for model interpretability
* Professional web interface built with Flask and HTML/CSS

## Tech Stack

* **Backend:** Python, Flask
* **Machine Learning:** Scikit-learn
* **Frontend:** HTML, CSS, JavaScript
* **Database:** SQLite
* **Visualization:** Chart.js, Matplotlib

## Machine Learning Model

The churn prediction model is trained using telecom customer data and algorithms such as:

* Decision Tree
* Random Forest / Gradient Boosting

The model predicts:

* Customer churn probability
* Customer retention probability

## Project Structure

```
Customer-Churn-Prediction
│
├── app.py
├── Model.sav
├── churn.db
│
├── templates
│   ├── login.html
│   ├── dashboard.html
│   └── home.html
│
├── static
│   └── decision_tree.png
│
└── README.md
```

## How to Run the Project

1. Clone the repository

```
git clone https://github.com/yourusername/customer-churn-prediction.git
```

2. Navigate to the project folder

```
cd customer-churn-prediction
```

3. Create and activate virtual environment

```
python -m venv venv
venv\Scripts\activate
```

4. Install required libraries

```
pip install flask pandas scikit-learn matplotlib
```

5. Run the application

```
python app.py
```

6. Open in browser

```
http://127.0.0.1:5000
```

## Login Credentials

```
Username: admin
Password: admin123
```

## Dashboard Analytics

The admin dashboard displays:

* Total predictions
* Churn vs retention statistics
* Bar chart and pie chart visualizations
* Decision tree model visualization
* Prediction history with timestamps

## Future Improvements

* Deploy the application on cloud platforms
* Add multiple user roles
* Improve model accuracy with advanced algorithms
* Implement real-time data analytics

## Author

Bhaskar Yadav
B.Tech Computer Science Student
