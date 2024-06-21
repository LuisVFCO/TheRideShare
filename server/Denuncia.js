const mongoose = require('mongoose');

const DenunciaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    rota: {
        type: String,
        required: true
    },
    veiculo: {
        type: String,
        required: true
    },
    placa: {
        type: String,
        required: true
    },
    hora: {
        type: String,
        required: true
    },
    zap: {
        type: String,
        required: true
    },
    local: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    }
});

module.exports = mongoose.model('Denuncia', DenunciaSchema);
