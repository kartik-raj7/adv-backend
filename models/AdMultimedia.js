import mongoose from 'mongoose';

const MultimediaSchema = new mongoose.Schema({
  url: { type: String, required: true, trim: true },
  secure_url: { type: String, required: true, trim: true },
  asset_id: { type: String, required: true, trim: true },
  public_id: { type: String, required: true, trim: true },
  format: { type: String, required: true, trim: true },
  resource_type: { type: String, required: true, trim: true },
  creator: { type: String, required: true, trim: true },
  // Add any other fields related to multimedia if needed
});

const MultimediaModel = mongoose.model('multimedia', MultimediaSchema);

export default MultimediaModel;