import { Schema, model } from 'mongoose';

const mediaSchema = new Schema(
    {
        name: {
            type: String,
            require: true
        },
        size: {
            type: Number
        },
        type: {
            type: String,
            require: true
        },
        slug: {
            tyle: String,
            lowercase: true,
            unique: true
        },
        duration: Number,
    }, 
    {
        timestamps: true
    }
)

mediaSchema.pre('validate', function(next) {
    if(!this.slug) {
        this.slugify()
    }

    next();
})

mediaSchema.method.slugify = () => {
    this.slug = slugify(this.name) + '-' + Date.now()
}

export default model('Media', mediaSchema);
