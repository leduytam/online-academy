import  { Schema, model } from 'mongoose';

const categorySchema = new Schema(
    {
        name: {
            type: String,
            require: true
        },
        description: String,
        subCategories: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'SubCategory'
            }
        ]
    }, 
    {
        timestamps: true
    }
)



export default model('Category', categorySchema);
