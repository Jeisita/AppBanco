const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/api/beneficio/evaluar', async (req, res) => {
    const { solicitudId, tipoBeneficio, ingresosMensuales, estrato, nucleoFamiliar, fechaNacimiento } = req.body;

    // 1. Registro en consola (Requerido) 
    console.log(`Solicitud recibida: ID ${solicitudId}, Tipo: ${tipoBeneficio}, Hora: ${new Date().toISOString()}`);

    // 2. Validaciones Robustas (HTTP 400) 
    if (ingresosMensuales <= 0) return res.status(400).json({ error: "Ingresos deben ser mayores a 0" });
    if (estrato < 1 || estrato > 6) return res.status(400).json({ error: "Estrato inválido (1-6)" });
    if (!solicitudId || !tipoBeneficio || !fechaNacimiento) return res.status(400).json({ error: "Faltan campos requeridos" });

    // 3. Simular procesamiento asíncrono (3-6 seg) 
    const delay = Math.floor(Math.random() * (6000 - 3000 + 1) + 3000);
    await new Promise(resolve => setTimeout(resolve, delay));

    // 4. Lógica de Elegibilidad (Array de Reglas) 
    let score = 0;
    let reglasAplicadas = [];
    const edad = new Date().getFullYear() - new Date(fechaNacimiento).getFullYear();

    const reglas = [
        { 
            nombre: "Ingreso Bajo", 
            cumple: ingresosMensuales <= 1000000, 
            puntos: 30 
        },
        { 
            nombre: "Ingreso Medio", 
            cumple: ingresosMensuales > 1000000 && ingresosMensuales <= 2000000, 
            puntos: 15 
        },
        { 
            nombre: "Estrato Vulnerable", 
            cumple: estrato <= 2, 
            puntos: 25 
        },
        { 
            nombre: "Familia Numerosa", 
            cumple: nucleoFamiliar >= 4, 
            puntos: 20 
        },
        { 
            nombre: "Adulto Mayor", 
            cumple: edad > 60, 
            puntos: 15 
        },
        { 
            nombre: "Bono Vivienda", 
            cumple: tipoBeneficio === "Vivienda" && estrato <= 2, 
            puntos: 10 
        }
    ];

    // Iteración con bucle for (Requisito del reto) [cite: 8, 10]
    for (let i = 0; i < reglas.length; i++) {
        if (reglas[i].cumple) {
            score += reglas[i].puntos;
            reglasAplicadas.push(reglas[i].nombre);
        }
    }

    // 5. Determinación del Estado Final 
    let estado = "Rechazado";
    if (score >= 60) {
        estado = "Aprobado";
    } else if (score >= 30) {
        estado = "En revisión";
    }

    // 6. Respuesta final (Output JSON) 
    res.json({
        solicitudId,
        score,
        estado,
        motivoDecision: `Reglas aplicadas: ${reglasAplicadas.join(', ')}. Puntaje total: ${score}.`
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});