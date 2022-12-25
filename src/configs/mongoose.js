import _ from 'lodash';
import mongoose from 'mongoose';
import msu from 'mongoose-slug-updater';

mongoose.plugin(msu);

mongoose.plugin((schema) => {
  schema.set('timestamps', true);

  const { transform: transformJson } = schema.get('toJSON') || {
    transform: (doc, ret) => ret,
  };

  const { transform: transformObject } = schema.get('toObject') || {
    transform: (doc, ret) => ret,
  };

  schema.set('toObject', {
    virtuals: true,
    transform: (doc, ret) => {
      return _.omit(transformObject(doc, ret), ['__v', 'id']);
    },
  });

  schema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
      return _.omit(transformJson(doc, ret), ['__v', 'id']);
    },
  });
});
