import * as process from "node:process";

export const config = {
    port: process.env.PORT || 3100,
    databaseUrl: process.env.MONGODB_URI || 'mongodb+srv://test_user:test123@cluster0.lybvqum.mongodb.net/?appName=Cluster0',
    socketPort: process.env.PORT || 3000,
    JwtSecret: "secret"
};