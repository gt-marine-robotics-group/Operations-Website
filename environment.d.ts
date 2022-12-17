declare global {
    namespace NodeJS {
        interface ProcessEnv {
            FAUNA_SECRET_KEY: string;
            INITIAL_ADMIN_PASSWORD: string;
            JWT_TOKEN_SIGNATURE: string;
        }
    }
}

export {}