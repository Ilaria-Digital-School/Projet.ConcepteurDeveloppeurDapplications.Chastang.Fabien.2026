# Configuration pour permettre à Django d'utiliser PyMySQL comme driver MySQL
try:
    import pymysql
    pymysql.install_as_MySQLdb()
except ImportError:
    pass

