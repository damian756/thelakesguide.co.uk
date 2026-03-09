import os, psycopg2
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv('.env.local')
u = os.getenv('DATABASE_URL')
p = urlparse(u)
conn = psycopg2.connect(
    host=p.hostname, port=p.port or 5432,
    database=p.path.lstrip('/'), user=p.username,
    password=p.password, sslmode='require'
)
cur = conn.cursor()

terms = [
    'Marine Drive', 'Esplanade', 'NCP', 'Tulketh', 'Eastbank Street',
    'Market Street', 'Promenade', 'Cambridge Road', 'Birkdale Station',
    'Ainsdale Beach', 'Formby Station Park', 'Lifeboat Road',
    'Victoria Road woodland', 'Victoria Road Car Park',
    'P+R Birkdale', 'Coach Park', 'RSPB Marshside',
]

for n in terms:
    cur.execute(
        'SELECT b.name, b.slug FROM "Business" b '
        'JOIN "Category" c ON b."categoryId" = c.id '
        'WHERE c.slug = %s AND b.name ILIKE %s LIMIT 2',
        ('parking', '%' + n + '%')
    )
    rows = cur.fetchall()
    for row in rows:
        print(f"{row[0][:55]:<57} {row[1]}")

conn.close()
