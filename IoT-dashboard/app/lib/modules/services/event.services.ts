import EventModel from '../schemas/event.schema';
import { IEvent } from "../models/event.model";

class EventServices {
    public async getAll() {
        try {
            return await EventModel.find({}).sort({date: 1});
        } catch (error) {
            console.log("Wystąpił błąd podczas pobierania zdarzeń: ", error);
            throw new Error("Wystąpił błąd podczas pobierania zdarzeń");
        }
    }

    public async getBySpaceName(spaceName: string) {
        try {
            return await EventModel.find({spaceName: spaceName}).sort({date: 1});
        } catch (error) {
            console.log(`Wystąpił błąd podczas pobierania zdarzeń dla miejsca ${spaceName}: `, error);
            throw new Error(`Wystąpił błąd podczas pobierania zdarzeń dla miejsca ${spaceName}`);
        }
    }

    public async createNewOrUpdate(event: IEvent) {
        try {
            if(!event._id) {
                const dataModel = new EventModel(event);
                return await dataModel.save();
            } else {
                return await EventModel.findByIdAndUpdate(event._id, { $set: event }, { new: true });
            }
        } catch (error) {
            console.log("Wystąpił błąd podczas tworzenia zdarzenia: ", error);
            throw new Error("Wystąpił błąd podczas tworzenia zdarzenia");
        }
    }
}

export default EventServices;