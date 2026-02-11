import os
import sys
import psycopg

print("SCRIPT:", os.path.abspath(__file__))
print("PYTHON:", sys.executable)

# Affiche si quelque chose peut influencer (si tu vois des valeurs ici, ça peut écraser)
for k in ["PGHOST", "PGPORT", "PGUSER", "PGPASSWORD", "PGDATABASE"]:
    print(f"{k} =", os.environ.get(k))

USER = "demo_user"
PWD = "demo_password"
DB = "demo_db"
HOST = "127.0.0.1"
PORT = 5433

print("USING:", {"host": HOST, "port": PORT, "dbname": DB, "user": USER, "password_len": len(PWD)})

# Connexion explicite (pas d'URL)
with psycopg.connect(host=HOST, port=PORT, dbname=DB, user=USER, password=PWD) as conn:
    with conn.cursor() as cur:
        cur.execute("SELECT 1;")
        print("RESULT:", cur.fetchone())

print("CONNECT OK (psycopg v3)")
