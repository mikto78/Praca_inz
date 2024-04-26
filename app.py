from flask import Flask, request, jsonify
from flask_cors import CORS
import pyodbc
from geopy.geocoders import Nominatim
from datetime import datetime
    
app = Flask(__name__)
CORS(app)

# String połączeniowy do bazy danych
conn_str = (
    r'DRIVER={ODBC Driver 17 for SQL Server};'
    r'SERVER=LAPTOP-C0AHJIA7\SQLEXPRESS;'
    r'DATABASE=praca_inz;'
    r'Trusted_Connection=yes;' 
)

# Próba nawiązania połączenia z bazą danych
try:
    cnxn = pyodbc.connect(conn_str, charset='utf-8')
    cursor = cnxn.cursor()
    print("Connected to the database")
except pyodbc.Error as ex:
    print("Connection Error: ", ex)

@app.route('/dekanaty', methods=['GET'])
def get_dekanaty():
    try:
        cnxn = pyodbc.connect(conn_str, charset='utf-8')
        cursor = cnxn.cursor()
        query = "SELECT Dekanat, geom.STAsText() as geom_text FROM Dekanaty"
        cursor.execute(query)
        dekanaty = [{"Dekanat": row[0], "geometry": row[-1]} for row in cursor.fetchall()]
        return jsonify(dekanaty)
    except pyodbc.Error as ex:
        return jsonify({"error": str(ex)}), 500
    

@app.route('/koscioly', methods=['GET'])
def get_koscioly():
    try:
        cnxn = pyodbc.connect(conn_str, charset='utf-8')
        cursor = cnxn.cursor()
        query = "SELECT Miejscowosc, Parafia, Kosciol, geom.STAsText() as geom_text FROM Kosciol2"
        cursor.execute(query)
        koscioly = [{"Miejscowosc": row[0], "Parafia": row[1], "Kosciol": row[2], "geometry": row[-1]} for row in cursor.fetchall()]
        return jsonify(koscioly)
    except pyodbc.Error as ex:
        return jsonify({"error": str(ex)}), 500
    
@app.route('/parafie', methods=['GET'])
def get_parafie():
    try:
        cnxn = pyodbc.connect(conn_str, charset='utf-8')
        cursor = cnxn.cursor()
        query = "SELECT Name, Miasto, Parafianie, Proboszcz, Dekanat, geom.STAsText() as geom_text FROM Parafie2"
        cursor.execute(query)
        parafie = [{"Name": row[0], "Miasto": row[1], "Parafianie": row[2],"Proboszcz": row[3],"Dekanat": row[4], "geometry": row[-1]} 
                   for row in cursor.fetchall()]
        return jsonify(parafie)
    except pyodbc.Error as ex:
        return jsonify({"error": str(ex)}), 500


@app.route('/send-data', methods=['POST'])
def receive_hour():
    data = request.json
    hour = data.get('hour')
    date = data.get('date')
    date_obj = datetime.strptime(date, '%Y-%m-%d')
    formatted_date = date_obj.strftime('%Y%m%d')
    address = data.get('address')

    geolocator = Nominatim(user_agent="your_app_name")
    location = geolocator.geocode(address)
    if not location:
        print("Nie można znaleźć współrzędnych dla podanego adresu.")
        return jsonify({"error": "Nie można znaleźć współrzędnych dla podanego adresu."}), 404

    print(f"Współrzędne dla adresu '{address}': {location.latitude}, {location.longitude}")

    try:
        cnxn = pyodbc.connect(conn_str, charset='utf-8')
        cursor = cnxn.cursor()
        
        query = f""" exec znajdz_msze '{formatted_date}', '{hour}', '{location.longitude}', '{location.latitude}' """
        cursor.execute(query)
        print (query)
        rows = cursor.fetchall()

        msze = [
            {
                "Kosciol": row[0],
                "godzina": row[1].strftime("%H:%M"),
                "odleglosc": row[2],
            }
            for row in rows
        ]
        print(msze)
        cnxn.close()
        return jsonify(msze), 200
    except pyodbc.Error as ex:
        print(f"Błąd: {str(ex)}")
        return jsonify({"error": str(ex)}), 500
    

@app.route('/send-data2', methods=['POST'])
def receive_hour2():
    data = request.json
    address = data.get('address')

    geolocator = Nominatim(user_agent="your_app_name")
    location = geolocator.geocode(address)
    if not location:
        print("Nie można znaleźć współrzędnych dla podanego adresu.")
        return jsonify({"error": "Nie można znaleźć współrzędnych dla podanego adresu."}), 404

    print(f"Współrzędne dla adresu '{address}': {location.latitude}, {location.longitude}")

    try:
        cnxn = pyodbc.connect(conn_str, charset='utf-8')
        cursor = cnxn.cursor()
        query = f"""SELECT Name, Parafianie, Proboszcz, Dekanat
                    FROM Parafie2
                    WHERE geography::STPointFromText('POINT({location.longitude} {location.latitude})', 4326).STWithin(geom) = 1"""
        cursor.execute(query)
        print (query)
        rows = cursor.fetchall()

        parafia = [
            {
                "Parafia": row[0],
                "Dekanat": row[3],
                "Parafianie": row[1],
                "Proboszcz": row[2]
            }
            for row in rows
        ]
        print(parafia)
        cnxn.close()
        return jsonify(parafia), 200
    except pyodbc.Error as ex:
        print(f"Błąd: {str(ex)}")
        return jsonify({"error": str(ex)}), 500


if __name__ == '__main__':
    app.run(debug=True)
