from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from enum import Enum

db = SQLAlchemy()

class EstadoDispensadora(Enum):
    ACTIVA = "activa"
    INACTIVA = "inactiva"
    ALERTA = "alerta"
    CRITICO = "critico"
    MANTENIMIENTO = "mantenimiento"

class Dispensadora(db.Model):
    """Modelo para las dispensadoras inteligentes"""
    __tablename__ = 'dispensadoras'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    ubicacion = db.Column(db.String(200), nullable=False)
    serial = db.Column(db.String(50), unique=True, nullable=False)
    tipo = db.Column(db.String(50), nullable=False)  # agua, café, snacks, etc.
    nivel_llenado = db.Column(db.Float, default=0)  # Porcentaje 0-100
    capacidad_litros = db.Column(db.Float, default=20)
    estado = db.Column(db.Enum(EstadoDispensadora), default=EstadoDispensadora.ACTIVA)
    temperatura = db.Column(db.Float, default=20)
    humedad = db.Column(db.Float, default=50)
    fecha_instalacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_ultimo_mantenimiento = db.Column(db.DateTime)
    activa = db.Column(db.Boolean, default=True)
    
    # Relaciones
    lecturas = db.relationship('Lectura', backref='dispensadora', lazy=True, cascade='all, delete-orphan')
    alertas = db.relationship('Alerta', backref='dispensadora', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'ubicacion': self.ubicacion,
            'serial': self.serial,
            'tipo': self.tipo,
            'nivel_llenado': self.nivel_llenado,
            'capacidad_litros': self.capacidad_litros,
            'estado': self.estado.value,
            'temperatura': self.temperatura,
            'humedad': self.humedad,
            'fecha_instalacion': self.fecha_instalacion.isoformat(),
            'fecha_ultimo_mantenimiento': self.fecha_ultimo_mantenimiento.isoformat() if self.fecha_ultimo_mantenimiento else None,
            'activa': self.activa
        }

class Lectura(db.Model):
    """Modelo para lecturas de sensores"""
    __tablename__ = 'lecturas'
    
    id = db.Column(db.Integer, primary_key=True)
    dispensadora_id = db.Column(db.Integer, db.ForeignKey('dispensadoras.id'), nullable=False)
    nivel_llenado = db.Column(db.Float)
    temperatura = db.Column(db.Float)
    humedad = db.Column(db.Float)
    presion = db.Column(db.Float)
    consumo_agua = db.Column(db.Float)  # Litros
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'dispensadora_id': self.dispensadora_id,
            'nivel_llenado': self.nivel_llenado,
            'temperatura': self.temperatura,
            'humedad': self.humedad,
            'presion': self.presion,
            'consumo_agua': self.consumo_agua,
            'timestamp': self.timestamp.isoformat()
        }

class Alerta(db.Model):
    """Modelo para alertas y notificaciones"""
    __tablename__ = 'alertas'
    
    id = db.Column(db.Integer, primary_key=True)
    dispensadora_id = db.Column(db.Integer, db.ForeignKey('dispensadoras.id'), nullable=False)
    tipo = db.Column(db.String(50), nullable=False)  # bajo_nivel, temperatura_alta, fallo_sensor, etc.
    descripcion = db.Column(db.String(500))
    severidad = db.Column(db.String(20), default='media')  # baja, media, alta, critica
    resuelta = db.Column(db.Boolean, default=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_resolucion = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'dispensadora_id': self.dispensadora_id,
            'tipo': self.tipo,
            'descripcion': self.descripcion,
            'severidad': self.severidad,
            'resuelta': self.resuelta,
            'fecha_creacion': self.fecha_creacion.isoformat(),
            'fecha_resolucion': self.fecha_resolucion.isoformat() if self.fecha_resolucion else None
        }

class Mantenimiento(db.Model):
    """Modelo para registro de mantenimientos"""
    __tablename__ = 'mantenimientos'
    
    id = db.Column(db.Integer, primary_key=True)
    dispensadora_id = db.Column(db.Integer, db.ForeignKey('dispensadoras.id'), nullable=False)
    tipo = db.Column(db.String(50), nullable=False)  # limpieza, reparacion, actualizacion, etc.
    descripcion = db.Column(db.String(500))
    responsable = db.Column(db.String(100))
    fecha_inicio = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_fin = db.Column(db.DateTime)
    costo = db.Column(db.Float, default=0)
    observaciones = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'dispensadora_id': self.dispensadora_id,
            'tipo': self.tipo,
            'descripcion': self.descripcion,
            'responsable': self.responsable,
            'fecha_inicio': self.fecha_inicio.isoformat(),
            'fecha_fin': self.fecha_fin.isoformat() if self.fecha_fin else None,
            'costo': self.costo,
            'observaciones': self.observaciones
        }
