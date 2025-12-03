import ParkingModel from '../schemas/parking.schema';
import {IParkingSpace, Query} from "../models/parking.model";
import { Document, Types } from 'mongoose';

export default class ParkingService {

    public async createNewOrUpdate(parkingSpace: IParkingSpace) {
        try {
            if(! await ParkingModel.findOne({name: parkingSpace.name})) {
                const dataModel = new ParkingModel(parkingSpace);
                return await dataModel.save();
            } else {
                return await ParkingModel.findOneAndUpdate({name: parkingSpace.name}, { $set: parkingSpace }, { new: true });
            }
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia lub aktualizacji miejsca:', error);
            throw new Error('Wystąpił błąd podczas tworzenia lub aktualizacji miejsca');
        }
    }

    public async update(parkingSpace: IParkingSpace) {
        try {
            return await ParkingModel.findOneAndUpdate({name: parkingSpace.name}, { $set: parkingSpace }, { new: true });
        } catch (error) {
            console.error('Wystąpił błąd podczas aktualizacji miejsca:', error);
            throw new Error('Wystąpił błąd podczas aktualizacji miejsca');
        }
    }

    public async get(name: string) {
        try {
            return await ParkingModel.findOne({name: name});
        } catch (error) {
            console.error(`Wystąpił błąd podczas pobierania danych miejsca ${name}:`, error);
            throw new Error(`Wystąpił błąd podczas pobierania danych miejsca ${name}`);
        }
    }

    public async getMany(names: string[]) {
        try {
            return await ParkingModel.find({name: {$in: names}}, {__v: 0, _id: 0}).sort({$natural: -1});
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania danych:', error);
            throw new Error('Wystąpił błąd podczas pobierania danych');
        }
    }

    public async getAll() {
        try {
            return await ParkingModel.find({}, {__v: 0, _id: 0});
        } catch(error) {
            console.error("Wystąpił błąd podczas pobierania danych", error);
            throw new Error("Wystąpił błąd podczas pobierania danych");
        }
    }

    public async delete(name: string) {
        try {
            return await ParkingModel.findOneAndDelete({name: name}, {__v: 0, _id: 0});
        } catch (error) {
            console.error(`Wystąpił błąd podczas usuwania danych z miejsca ${name}:`, error);
            throw new Error(`Wystąpił błąd podczas usuwania danych z miejsca ${name}`);
        }
    }

    public async deleteMany(names: string[]) {
        try {
            return await ParkingModel.deleteMany({name: {$in: names}}, {__v: 0, _id: 0});
        } catch (error) {
            console.error(`Wystąpił błąd podczas usuwania danych z miejsc:`, error);
            throw new Error(`Wystąpił błąd podczas usuwania danych z miejsc`);
        }
    }
}
