class Photo {
  constructor(filename, lat, lng, uploaderID, organisationID)
  {
    this.filename = filename;
    this.lat = lat;
    this.lng = lng;
    this.uploaderID = uploaderID;
    this.organisationID = organisationID;
  }
}

module.exports = Photo;
