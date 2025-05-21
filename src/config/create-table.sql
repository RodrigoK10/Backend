-- Crear tabla de usuarios si no existe
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='usuarios' and xtype='U')
BEGIN
    CREATE TABLE usuarios (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre NVARCHAR(100) NOT NULL,
        email NVARCHAR(100) NOT NULL,
        telefono NVARCHAR(20)
    )
    PRINT 'Tabla usuarios creada exitosamente'
END
ELSE
BEGIN
    PRINT 'La tabla usuarios ya existe'
END 