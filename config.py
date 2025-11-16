import os
from datetime import timedelta

class Config:
    """Configuración base de la aplicación"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # Base de datos en la nube (MySQL, PostgreSQL, SQL Server, etc.)
    # Ejemplos:
    # MySQL: mysql+pymysql://usuario:password@host:puerto/basedatos
    # PostgreSQL: postgresql://usuario:password@host:puerto/basedatos
    # SQL Server: mssql+pyodbc://usuario:password@host/basedatos?driver=ODBC+Driver+17+for+SQL+Server
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'mysql+pymysql://usuario:password@localhost/dispensadoras'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Power BI
    POWERBI_EMBED_URL = os.environ.get('POWERBI_EMBED_URL') or ''
    POWERBI_REPORT_ID = os.environ.get('POWERBI_REPORT_ID') or 'your-report-id'
    POWERBI_WORKSPACE_ID = os.environ.get('POWERBI_WORKSPACE_ID') or 'your-workspace-id'
    
    # Azure AD para Power BI
    AZURE_CLIENT_ID = os.environ.get('AZURE_CLIENT_ID') or ''
    AZURE_CLIENT_SECRET = os.environ.get('AZURE_CLIENT_SECRET') or ''
    AZURE_TENANT_ID = os.environ.get('AZURE_TENANT_ID') or ''
    
    # Configuración de sesión
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)

class DevelopmentConfig(Config):
    """Configuración para desarrollo"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Configuración para producción"""
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    """Configuración para testing"""
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}