import PasswordModel  from '../schemas/password.schema';
import bcrypt from 'bcrypt';
import { ObjectId } from "mongodb";

class PasswordService {
    async createOrUpdate({ userId, password }: { userId: string; password: string }): Promise<void> {
        try {
            const existing = await PasswordModel.findOne({ userId });

            if (existing) {
                existing.password = password;
                await existing.save();
            } else {
                await PasswordModel.create({ userId, password });
            }
        } catch (error) {
            console.error(`CreateOrUpdate Password Error: ${error.message}`);
            throw new Error('Failed to save password');
        }
    }

    public async authorize(userId: string, password: string) {
        try {
            const result = await PasswordModel.findOne({ userId: userId });
            if(!result) return false;
            return bcrypt.compare(password, result.password);
        } catch (error) {
            console.error(`Authorize Error: ${error.message}`);
            return false;
        }

    }

    public async deleteByUserId(userId: string) {
        try {
            await PasswordModel.deleteOne({ userId: userId });
        } catch (error) {
            console.error(`User Delete Error: ${error.message}`);
            throw new Error('Failed to delete password');
        }
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log('hash', hashedPassword)
        return hashedPassword;
    }

}

export default PasswordService;