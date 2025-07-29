"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Room_1 = __importDefault(require("./routes/Room"));
const User_1 = __importDefault(require("./routes/User"));
const swagger_1 = require("./swagger");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, swagger_1.setupSwagger)(app);
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use('/rooms', Room_1.default);
app.use('/session', User_1.default);
const PORT = process.env.PORT || 5000;
mongoose_1.default.connect(process.env.MONGO_URI || '').then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
