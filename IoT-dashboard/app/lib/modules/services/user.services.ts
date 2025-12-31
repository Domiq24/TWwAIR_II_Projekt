import  UserModel  from '../schemas/user.schema';
import { IUser } from "../models/user.model";
import { ObjectId } from "mongodb";

class UserServices {
    public async getAll() {
        try {
            return await UserModel.find().sort({natural: -1});
        } catch (error) {
            console.log("Wystąpił błąd podczas pobierania urzytkoników: ", error);
            throw new Error("Wystąpił błąd podczas pobierania urzytkoników");
        }
    }

    public async createNewOrUpdate(user: IUser) {
        try {
            if (!user._id) {
                const dataModel = new UserModel(user);
                return await dataModel.save();
            } else {
                return await UserModel.findByIdAndUpdate(user._id, { $set: user }, { new: true });
            }
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia użytkownika:', error);
            throw new Error('Wystąpił błąd podczas tworzenia użytkownika');
        }
    }

    public async getByEmailOrName(name: string) {
        try {
            const result = await UserModel.findOne({ $or: [{ email: name }, { name: name }] });
            if (result) {
                return result;
            }
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania danych:', error);
            throw new Error('Wystąpił błąd podczas pobierania danych');
        }
    }

    public async deleteById(id: string) {
        try {
            const result = await UserModel.deleteOne({ _id: id });
            if (result) { return true; }
        } catch (error) {
            console.error('Wystąpił błąd podczas usówania danych:', error);
            throw new Error('Wystąpił błąd podczas usówania danych');
        }
    }
}

export default UserServices;