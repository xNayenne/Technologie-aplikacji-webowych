import { posix } from "path";
import { IData, Query } from "../models/data.model";
import PostModel from '../schemas/data.schema';

class DataService {
    public async createPost(postParams: IData) {
        try {
            const dataModel = new PostModel(postParams);
            await dataModel.save();
        } catch (error) {
            console.error('Error ocurred while creating data:', error);
            throw new Error('Error ocurred while creating data');
        }
    }

    public async query(query: Query<number | string | boolean>) {
        try {
            const result = await PostModel.find(query, { __v: 0, _id: 0 });
            return result;
        } catch (error) {
            console.error('Querry failed:', error);
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async getAllPosts() {
        try {
            const result = await PostModel.find({}, {__v:0});
            return result;
        } catch (error) {
            console.error('Error occurred while retrieving all posts:', error);
            throw new Error('Error occurred while retrieving all posts');
        }
    }

    public async deleteData(query: Query<number | string | boolean>) {
        try {
            await PostModel.deleteMany(query);
        } catch (error) {
            console.error('Error ocurred while deleting data:', error);
            throw new Error('Error ocurred while deleting data');
        }
    }
}

export default DataService;