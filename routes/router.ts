import { Router, Request, Response } from 'express';
import Server from '../classes/server';
import { Socket } from 'socket.io';
import { usuariosConectados } from '../sockets/socket';

const router = Router();

router.get('/mensajes', (req: Request, res: Response) => {
    res.json({
        ok: true,
        mensaje: 'Todo esta bien!!',
    });
});

router.post('/mensajes', (req: Request, res: Response) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;

    const server = Server.instace;
    const payload = {
        de,
        cuerpo,
    };

    server.io.emit('mensaje-nuevo', payload);

    res.json({
        ok: true,
        cuerpo,
        de,
    });
});

router.post('/mensajes/:id', (req: Request, res: Response) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;

    const server = Server.instace;
    const payload = {
        de,
        cuerpo,
    };

    server.io.in(id).emit('mensaje-privado', payload);

    res.json({
        ok: true,
        cuerpo,
        de,
        id,
    });
});

// Servicio para obtener todos los id's de los usuarios

router.get('/usuarios', (_req: Request, res: Response) => {
    const server = Server.instace;

    server.io.clients((err: any, clientes: string[]) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            clientes,
        });
    });
});

// Obtener usuarios y sus nombres

router.get('/usuarios/detalle', (req: Request, res: Response) => {
    res.json({
        ok: true,
        clientes: usuariosConectados.getLista(),
    });
});

export default router;
