import AdsModel from "../../models/Ads.js";
const deleteExpiredJobs = async () => {
    const currentDate = new Date();
    try {
      const allAds = await AdsModel.find({});
      await Promise.all(allAds.map(async(data, index) => {
        const expirationDate = new Date(data.ad_expirationtime.slice(0, 10));
        if(expirationDate<currentDate){
            // console.log(expirationDate);
            await AdsModel.findOneAndDelete({
                _id: data._id,
                ad_creator: data.ad_creator,
              });
        }     
        // console.log("expiration time = " ,expirationDate,"current date=",currentDate,expirationDate < currentDate);
      }))
     
    } catch (error) {
      console.error('Error deleting expired jobs:', error);
    }
  };
  export {deleteExpiredJobs}