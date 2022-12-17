import mongoose, { Schema, model } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import slugify from 'slugify';

const lessonSchema = new Schema(
    {
        name: {
            type: String,
            require: true
        },
        content: String,
        slug: {
            tyle: String,
            lowercase: true,
            unique: true
        },
    }, 
    {
        timestamps: true
    }
)

lessonSchema.plugin(mongooseUniqueValidator, {message: 'This course is already taken'})

lessonSchema.pre('validate', function(next) {
    if(!this.slug) {
        this.slugify()
    }

    next();
})

lessonSchema.method.slugify = () => {
    this.slug = slugify(this.name)
}

export default model('Lesson', lessonSchema);
