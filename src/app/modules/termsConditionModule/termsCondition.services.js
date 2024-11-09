import TermsCondition from './termsCondition.model.js';

// service to create new terms and condition
const createTermsCondition = async (data) => {
  return await TermsCondition.create(data);
};

// service to get terms and condition
const getTermsCondition = async () => {
  return await TermsCondition.findOne({});
};

// service to get specific terms and condition by ID
const getSpecificTermsCondition = async (id) => {
  return await TermsCondition.findOne({ _id: id });
};

// service to update terms and condition
const updateTermsCondition = async (id, data) => {
  return await TermsCondition.updateOne({ _id: id }, data, {
    runValidators: true
  });
};

export default {
  createTermsCondition,
  getTermsCondition,
  getSpecificTermsCondition,
  updateTermsCondition
};
