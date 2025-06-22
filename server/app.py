from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql.cursors # atau psycopg2 untuk PostgreSQL
import datetime

app = Flask(__name__)
CORS(app) # Mengizinkan CORS untuk development

# Konfigurasi Database (Ganti dengan kredensial Anda)
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'password',
    'db': 'telkomsel_sales',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

def get_db_connection():
    return pymysql.connect(**DB_CONFIG)

@app.route('/api/penjualan', methods=['GET'])
def get_penjualan():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT * FROM penjualan ORDER BY tanggal DESC"
            cursor.execute(sql)
            result = cursor.fetchall()
            return jsonify(result)
    finally:
        connection.close()

@app.route('/api/penjualan', methods=['POST'])
def add_penjualan():
    data = request.json
    tanggal = datetime.date.today().isoformat() # Tanggal hari ini
    produk = data.get('produk')
    harga = data.get('harga')
    nomor_pelanggan = data.get('nomorPelanggan')

    if not all([produk, harga, nomor_pelanggan]):
        return jsonify({'message': 'Data tidak lengkap'}), 400

    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "INSERT INTO penjualan (tanggal, produk, harga, nomor_pelanggan) VALUES (%s, %s, %s, %s)"
            cursor.execute(sql, (tanggal, produk, harga, nomor_pelanggan))
        connection.commit()
        return jsonify({'message': 'Penjualan berhasil dicatat', 'id': cursor.lastrowid}), 201
    except Exception as e:
        connection.rollback()
        return jsonify({'message': 'Terjadi kesalahan', 'error': str(e)}), 500
    finally:
        connection.close()

@app.route('/api/penjualan/<int:id>', methods=['DELETE'])
def delete_penjualan(id):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "DELETE FROM penjualan WHERE id = %s"
            cursor.execute(sql, (id,))
        connection.commit()
        if cursor.rowcount == 0:
            return jsonify({'message': 'Penjualan tidak ditemukan'}), 404
        return jsonify({'message': 'Penjualan berhasil dihapus'}), 200
    except Exception as e:
        connection.rollback()
        return jsonify({'message': 'Terjadi kesalahan', 'error': str(e)}), 500
    finally:
        connection.close()

if __name__ == '__main__':
    app.run(debug=True) # debug=True hanya untuk development
