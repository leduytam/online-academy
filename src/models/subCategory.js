import  { Schema, model } from 'mongoose';

const subCategorySchema = new Schema(
    {
        name: {
            type: String,
            require: true,
        },
        description: String,
    }, 
    {
        timestamps: true
    }
)

export default model('SubCategory', subCategorySchema);
