import mongoose, { Schema, model } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import slugify from 'slugify';

const courseSchema = new Schema(
    {
        name: {
            type: String,
            require: true
        },
        slug: {
            tyle: String,
            lowercase: true,
            unique: true
        },
        briefDescirption: String,
        detail: String,
        done: Boolean,
        price: Number,
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }, 
    {
        timestamps: true
    }
)

courseSchema.plugin(mongooseUniqueValidator, {message: 'This course is already taken'})

courseSchema.pre('validate', function(next) {
    if(!this.slug) {
        this.slugify()
    }

    next();
})

courseSchema.method.slugify = () => {
    this.slug = slugify(this.name)
}

export default model('Course', courseSchema);
