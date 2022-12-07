import camelcaseKeys from 'camelcase-keys';

const camelcase = () => {
  return (req, res, next) => {
    req.body = camelcaseKeys(req.body, { deep: true });
    req.params = camelcaseKeys(req.params);
    req.query = camelcaseKeys(req.query);
    req.cookies = camelcaseKeys(req.cookies);
    next();
  };
};

export default camelcase;
