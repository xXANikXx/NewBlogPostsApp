import {config} from 'dotenv'

config()

export const appConfig = {
    PORT: process.env.PORT || '5001',
    MONGO_URL: process.env.MONGO_URL || 'mongodb+srv://nik:nik@lesson.mezyenu.mongodb.net/blogspostsapp?retryWrites=true&w=majority',
    DB_NAME: process.env.DB_NAME || 'blogsPostsApp',
    AC_SECRET: process.env.AC_SECRET || 'default_secret_key',
    AC_TIME: process.env.AC_TIME || '700',
    RT_SECRET: process.env.RT_SECRET || 'default_refresh_secret',
    DB_TYPE: process.env.DB_TYPE || 'test',
    EMAIL: process.env.EMAIL || '',
    EMAIL_PASS: process.env.EMAIL_PASS || '',
}

console.log('✅ Loaded appConfig:', appConfig);