import os
from flask import Flask, request, redirect, url_for, render_template
import mysql.connector
from flask import jsonify
import json

app = Flask(__name__)

# Database connection details
db_config = {
    'user': os.environ.get('DB_USER', 'default_user'),
    'password': os.environ.get('DB_PASSWORD', 'default_password'),
    'host': os.environ.get('DB_HOST', 'default_host'),
    'database': os.environ.get('DB_NAME', 'default_db')
}

@app.route('/submit', methods=['POST'])
def submit_order():
    if request.method == 'POST':
        try:
            data = request.json

            cnx = mysql.connector.connect(**db_config)
            cursor = cnx.cursor()

            insert_order_query = ("INSERT INTO orders "
                                  "(name, billing_address, ag_and_hzi, date, quote_no, contact_phone, email, data_delivery, signature, experiment_title) "
                                  "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
            order_data = (data['name'], data['billing_address'], data['ag_and_hzi'], data['date'], data['quote_no'], data['contact_phone'], data['email'], data['data_delivery'], data['signature'], data['experiment_title'])
            cursor.execute(insert_order_query, order_data)
            order_id = cursor.lastrowid

            for sample in data['samples']:
                insert_sample_query = ("INSERT INTO samples "
                                       "(order_id, sample_name, concentration, volume, ratio_260_280, a260_230, comments) "
                                       "VALUES (%s, %s, %s, %s, %s, %s, %s)")
                sample_data = (order_id, sample['sample_name'], sample['concentration'], sample['volume'], sample['ratio_260_280'], sample['a260_230'], sample['comments'])
                cursor.execute(insert_sample_query, sample_data)

            cnx.commit()
            cursor.close()
            cnx.close()

            return jsonify({'status': 'success', 'message': 'Order submitted successfully'})
        except Exception as e:
            return jsonify({'status': 'error', 'message': str(e)})

    return jsonify({'status': 'error', 'message': 'Invalid request method'})

@app.route('/success')
def success():
    return render_template('success.html')

@app.route('/error')
def error():
    return render_template('error.html')

@app.route('/')
def display_form():
    return render_template('ngs_order_form.html')

@app.route('/db_status')
def db_status():
    try:
        cnx = mysql.connector.connect(**db_config)
        if cnx.is_connected():
            cnx.close()
            return {'status': 'connected', 'message': 'Connected to test database'}
    except mysql.connector.Error as err:
        return {'status': 'disconnected', 'message': 'Database connection failed'}

    return {'status': 'disconnected', 'message': 'Database connection failed'}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)

