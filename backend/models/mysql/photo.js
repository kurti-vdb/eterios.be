class Photo {
  constructor(filename, lat, lng, uploaderID, organisationID, created)
  {
    this.filename = filename;
    this.lat = lat;
    this.lng = lng;
    this.uploaderID = uploaderID;
    this.organisationID = organisationID;
    this.created = created;
  }
}

module.exports = Photo;
