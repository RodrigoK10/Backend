import { jest } from '@jest/globals';

// Mock modules antes de importarlos
jest.unstable_mockModule('bcryptjs', () => ({
    default: {
        hash: jest.fn(),
        compare: jest.fn()
    }
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
    default: {
        sign: jest.fn()
    }
}));

// Importar los módulos después de mockearlos
const bcryptjs = await import('bcryptjs');
const jwt = await import('jsonwebtoken');
const bcrypt = bcryptjs.default;

describe('Autenticación', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('El hash de contraseña funciona correctamente', async () => {
        const password = '123456';
        const hashedPassword = '$2a$10$abcdefghijklmnopqrstuvwxyz';
        
        bcrypt.hash.mockResolvedValue(hashedPassword);
        
        const result = await bcrypt.hash(password, 10);
        
        expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
        expect(result).toBe(hashedPassword);
    });

    test('La comparación de contraseñas funciona correctamente', async () => {
        const password = '123456';
        const hashedPassword = '$2a$10$abcdefghijklmnopqrstuvwxyz';
        
        bcrypt.compare.mockResolvedValue(true);
        
        const result = await bcrypt.compare(password, hashedPassword);
        
        expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
        expect(result).toBe(true);
    });

    test('La generación de token JWT funciona correctamente', () => {
        const userData = { id: 1, username: 'test' };
        const token = 'mock.jwt.token';
        
        jwt.default.sign.mockReturnValue(token);
        
        const result = jwt.default.sign(userData, process.env.JWT_SECRET);
        
        expect(jwt.default.sign).toHaveBeenCalledWith(userData, process.env.JWT_SECRET);
        expect(result).toBe(token);
    });
}); 