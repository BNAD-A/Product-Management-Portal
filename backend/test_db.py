import socket
import traceback
import psycopg2

HOST = "127.0.0.1"
PORT = 5432

print("Socket test...")
s = socket.socket()
s.settimeout(3)
code = s.connect_ex((HOST, PORT))
print("connect_ex code =", code)  # 0 = port open
s.close()

print("\nPsycopg2 test...")
try:
    psycopg2.connect(
    "dbname=demo_db user=demo_user password=demo_password host=127.0.0.1 port=5432 sslmode=disable connect_timeout=3"
)
except Exception as e:
    import traceback
    print("CONNECT FAIL repr:", repr(e))
    print("CONNECT FAIL type:", type(e))
    traceback.print_exc()
