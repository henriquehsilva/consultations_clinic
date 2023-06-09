import Consultation from '../models/consultation.model.js';

class ConsultationService {

  create = (id, consultation) => {

    return new Consultation({ 
      id: id,
      date: consultation.date, 
      time: consultation.time,
      specialty: consultation.specialty,
      userId: consultation.userId

    }).save();
  }

  deleteById = (id) => {
    return Consultation.deleteOne({ id: id }).then((consultation) => {
      return consultation;
    }).catch((error) => {
      console.log(error);
    });
  }
}

export default new ConsultationService();