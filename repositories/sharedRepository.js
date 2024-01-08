class SharedRepository {
    constructor(model) {
      this.model = model;
    }
    async create(document) {
      const createdDocument = await this.model.create(document);
      return createdDocument;
    }
  
    async findByIdAndUpdate(documentId, newData) {
      const updatedDocument = await this.model.findByIdAndUpdate(
        documentId,
        newData,
        {
          new: true,
        }
      );
      return updatedDocument;
    }
  

    async findById(documentId) {
      const document = await this.model.findById(documentId);
      return document;
    }
  
    async findByIdAndDelete(documentId) {
      const document = await this.model.findByIdAndDelete(documentId);
      return document;
    }
  
    async findAll() {
      const document = await this.model.find();
      return document;
    }
  
    async findOne(key) {
      const document = await this.model.findOne(key);
      return document;
    }
  
    async find(key) {
      const document = await this.model.find(key);
      return document;
    }

    async findAndPopulate(key) {
      const document = await this.model.find(key).populate('profile','appointmets_per_slot slots sub_slots') // Specify the fields you want to populate
      .exec();
      return document;
    }

    async removeItemsFromArr (id,query){


      const document = await this.model.findByIdAndUpdate(id,
          { $pull: query },
          {new: true}
  
  )
  return document
  }
  
  }
  module.exports = SharedRepository;
  